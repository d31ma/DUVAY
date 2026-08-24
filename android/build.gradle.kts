plugins {
    kotlin("jvm") version "2.1.10" apply false
    kotlin("android") version "2.1.10" apply false
    id("com.android.library") version "8.7.3" apply false
    id("com.android.application") version "8.7.3" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.1.10" apply false
    // Paparazzi renders Compose through layoutlib on the JVM, so the
    // snapshot suite needs no emulator and no device — the same reason
    // :duvay-core stays off Android for the conformance suite.
    id("app.cash.paparazzi") version "1.3.5" apply false
}
