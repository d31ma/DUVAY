// DuVay — SwiftUI snapshot suite (Apple)
//
// The plan requires a snapshot suite per platform before a tier may be
// published as supported. This is the Apple one.
//
// Rolled on SwiftUI's own `ImageRenderer` rather than taking a snapshot-testing
// dependency: the whole library is three targets with no external packages, and
// rendering a view to a CGImage and hashing it is about forty lines. Nothing a
// dependency would add here is worth the supply chain.
//
// Comparison is on a downsampled 16x16 RGB grid, not on raw pixels. Text
// rasterisation changes between OS versions and between Apple Silicon and
// Intel, so exact-pixel equality produces a suite that fails on upgrade rather
// than on regression. The grid keeps layout, geometry and colour — what a
// visual regression actually looks like — while tolerating sub-pixel
// antialiasing differences.
//
//   swift test --filter Snapshots
//   DUVAY_RECORD_SNAPSHOTS=1 swift test --filter Snapshots   (re-record)

import Testing
import SwiftUI
import Foundation
@testable import DuVay
import DuVayTokens

#if canImport(AppKit)
import AppKit
#endif

/// A coarse RGB fingerprint of a rendered view.
struct Snapshot: Equatable, Codable, Sendable {
    /// Grid resolution. 16x16 is fine enough to catch a moved control or a
    /// changed fill, coarse enough that a font-rendering tweak does not trip it.
    static let side = 16
    /// Quantisation step. Each channel is bucketed into 16 levels so a
    /// slightly different blend still lands in the same bucket.
    static let levels = 16

    var cells: [Int]
    var width: Int
    var height: Int

    /// Channel samples that differ by more than one quantisation bucket.
    func differences(from other: Snapshot) -> Int {
        guard cells.count == other.cells.count else { return cells.count }
        return zip(cells, other.cells).reduce(0) { $0 + (abs($1.0 - $1.1) > 1 ? 1 : 0) }
    }
}

@MainActor
enum SnapshotRenderer {
    /// Render a view and reduce it to an RGB grid.
    static func capture<V: View>(_ view: V, size: CGSize) -> Snapshot? {
        let renderer = ImageRenderer(content: view.frame(width: size.width, height: size.height))
        renderer.scale = 1
        #if canImport(AppKit)
        guard let cgImage = renderer.cgImage else { return nil }
        return fingerprint(cgImage)
        #else
        guard let cgImage = renderer.cgImage else { return nil }
        return fingerprint(cgImage)
        #endif
    }

    private static func fingerprint(_ image: CGImage) -> Snapshot? {
        let side = Snapshot.side
        // RGB, not luminance. A greyscale fingerprint cannot see hue: swapping a
        // filled button's accent for the error colour left the grid untouched,
        // because the two have almost the same luminance. Colour is most of what
        // a design system regresses, so the channels are kept separate.
        let bytesPerRow = side * 4
        var buffer = [UInt8](repeating: 0, count: bytesPerRow * side)
        guard let space = CGColorSpace(name: CGColorSpace.sRGB) else { return nil }
        let ok: Bool = buffer.withUnsafeMutableBytes { raw -> Bool in
            guard let context = CGContext(
                data: raw.baseAddress,
                width: side, height: side,
                bitsPerComponent: 8, bytesPerRow: bytesPerRow,
                space: space,
                bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
            ) else { return false }
            context.interpolationQuality = .medium
            context.draw(image, in: CGRect(x: 0, y: 0, width: side, height: side))
            return true
        }
        guard ok else { return nil }

        let step = 256 / Snapshot.levels
        var cells: [Int] = []
        cells.reserveCapacity(side * side * 3)
        for pixel in stride(from: 0, to: buffer.count, by: 4) {
            cells.append(Int(buffer[pixel]) / step)       // R
            cells.append(Int(buffer[pixel + 1]) / step)   // G
            cells.append(Int(buffer[pixel + 2]) / step)   // B
        }
        return Snapshot(cells: cells, width: image.width, height: image.height)
    }
}

/// Where recorded snapshots live. Committed, so a regression shows up in review.
enum SnapshotStore {
    static var directory: URL {
        URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .appendingPathComponent("__Snapshots__")
    }

    static var isRecording: Bool {
        ProcessInfo.processInfo.environment["DUVAY_RECORD_SNAPSHOTS"] == "1"
    }

    static func url(_ name: String) -> URL {
        directory.appendingPathComponent("\(name).json")
    }

    static func read(_ name: String) -> Snapshot? {
        guard let data = try? Data(contentsOf: url(name)) else { return nil }
        return try? JSONDecoder().decode(Snapshot.self, from: data)
    }

    static func write(_ snapshot: Snapshot, name: String) throws {
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        try encoder.encode(snapshot).write(to: url(name))
    }
}

@MainActor
@Suite("Snapshots")
struct SnapshotTests {

    /// Assert a view still renders as recorded.
    ///
    /// A missing recording is a failure rather than a silent pass: a suite that
    /// records on first run would go green on a machine that has never seen the
    /// component, which is exactly when you want it to complain.
    func assertSnapshot<V: View>(
        _ view: V,
        named name: String,
        size: CGSize = CGSize(width: 320, height: 120),
        sourceLocation: SourceLocation = #_sourceLocation
    ) throws {
        guard let taken = SnapshotRenderer.capture(view, size: size) else {
            Issue.record("could not render \(name)", sourceLocation: sourceLocation)
            return
        }

        if SnapshotStore.isRecording {
            try SnapshotStore.write(taken, name: name)
            return
        }

        guard let recorded = SnapshotStore.read(name) else {
            Issue.record(
                "no recording for \(name) — run with DUVAY_RECORD_SNAPSHOTS=1",
                sourceLocation: sourceLocation
            )
            return
        }

        // Allow a couple of cells to drift: a shadow or a focus ring landing on
        // a grid boundary can flip one bucket without anything having changed.
        let drift = taken.differences(from: recorded)
        #expect(
            drift <= 2,
            "\(name) drifted in \(drift) of \(recorded.cells.count) cells",
            sourceLocation: sourceLocation
        )
    }

    private func themed<V: View>(_ view: V, _ theme: DuVayTokens.Theme = .light) -> some View {
        view.duvayTheme(theme).padding(8).background(Color.white)
    }

    @Test("button variants")
    func buttons() throws {
        try assertSnapshot(themed(VStack(spacing: 8) {
            DuVayButton(variant: .filled, action: {}) { Text("Filled") }
            DuVayButton(variant: .outlined, action: {}) { Text("Outlined") }
            DuVayButton(variant: .text, action: {}) { Text("Text") }
        }), named: "buttons-variants")
    }

    @Test("selection controls")
    func selectionControls() throws {
        try assertSnapshot(themed(VStack(spacing: 8) {
            DuVayToggle("Toggle", isOn: .constant(true))
            DuVayCheckbox("Checkbox", isOn: .constant(true))
        }), named: "selection-controls")
    }

    @Test("text field")
    func textField() throws {
        try assertSnapshot(themed(
            DuVayTextField("Label", text: .constant("Ada"))
        ), named: "text-field")
    }

    @Test("progress indicators")
    func progress() throws {
        try assertSnapshot(themed(VStack(spacing: 12) {
            DuVayProgressBar(value: 0.4)
            DuVayProgressRing(value: 0.4)
        }), named: "progress")
    }

    @Test("card with content")
    func card() throws {
        try assertSnapshot(themed(
            DuVayCard { Text("Card body") }
        ), named: "card")
    }

    /// Dark is not a recolour of light — it is a separate palette with its own
    /// contrast guarantees, so it gets its own recording.
    @Test("buttons in the dark theme")
    func buttonsDark() throws {
        try assertSnapshot(
            VStack(spacing: 8) {
                DuVayButton(variant: .filled, action: {}) { Text("Filled") }
                DuVayButton(variant: .outlined, action: {}) { Text("Outlined") }
            }
            .duvayTheme(.dark)
            .padding(8)
            .background(Color.black),
            named: "buttons-dark"
        )
    }
}
