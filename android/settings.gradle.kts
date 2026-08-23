// DuVay for Android — Phase 3 of CROSS-PLATFORM-PLAN.md.
//
// Two modules on purpose:
//   duvay-core     pure Kotlin/JVM — tokens and behaviour. The conformance
//                  suite lives here, so `./gradlew :duvay-core:test` proves
//                  parity without the Android SDK or an emulator.
//   duvay-compose  the Jetpack Compose component library (Android library).
//
// Keeping the contract-bearing code off Android is what makes the shared
// fixture suite cheap to run in CI.

pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}

// The modules pin a JDK 17 toolchain because that is what the Android Gradle
// Plugin supports. Without a resolver, Gradle can only use a JDK 17 that
// already happens to be installed, so the build breaks on any machine that has
// moved on to a newer JDK. This lets Gradle fetch the pinned toolchain itself.
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}
dependencyResolutionManagement {
    repositories { google(); mavenCentral() }
}

rootProject.name = "duvay"
include(":duvay-core")
include(":duvay-compose")
include(":gallery")
