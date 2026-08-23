// swift-tools-version: 6.0
//
// DuVay for Apple platforms — Phase 2 of CROSS-PLATFORM-PLAN.md.
//
// One package, two platforms. SwiftUI rather than UIKit/AppKit: Fluent chose
// UIKit in 2019 and is still migrating, and SwiftUI covers iOS and macOS from
// a single source, which is why Apple is sequenced first.
//
//   DuVayTokens   generated design tokens (bun run tokens:native)
//   DuVayCore     platform-independent behaviour, validated by spec/fixtures
//   DuVay         the SwiftUI component library
//
// DuVayCore deliberately has no SwiftUI dependency: it is the layer the
// conformance suite exercises, and keeping it UI-free means the fixtures test
// logic rather than rendering.

import PackageDescription

let package = Package(
    name: "DuVay",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "DuVay", targets: ["DuVay"]),
        .library(name: "DuVayCore", targets: ["DuVayCore"]),
        .library(name: "DuVayTokens", targets: ["DuVayTokens"]),
    ],
    targets: [
        .target(name: "DuVayTokens"),
        .target(name: "DuVayCore"),
        .target(name: "DuVay", dependencies: ["DuVayCore", "DuVayTokens"]),
        .testTarget(
            name: "DuVayCoreTests",
            dependencies: ["DuVayCore"],
            // The conformance fixtures are the shared contract with the other
            // four platforms; they are read from spec/ at test time rather than
            // copied, so a fixture change cannot silently go unnoticed here.
            resources: [.copy("Fixtures")]
        ),
        .testTarget(name: "DuVayTests", dependencies: ["DuVay", "DuVayTokens"]),
    ]
)
