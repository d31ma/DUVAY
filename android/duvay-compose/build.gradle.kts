// DuVay for Android — the Jetpack Compose component library.
//
// Depends on :duvay-core for tokens and behaviour. Core stays a plain Kotlin
// module so the conformance suite runs without the Android SDK; only this
// module needs a device or emulator.

plugins {
    id("com.android.library")
    kotlin("android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("app.cash.paparazzi")
}

android {
    namespace = "ma.del.duvay.compose"
    compileSdk = 35

    defaultConfig {
        minSdk = 24
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures { compose = true }
}

kotlin { jvmToolchain(17) }

dependencies {
    api(project(":duvay-core"))
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.foundation:foundation")
    // Material 3 supplies the native widgets DuVay themes; the plan is explicit
    // that this maps DuVay semantics onto md.sys.* rather than redrawing them.
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-core")
    // rememberLauncherForActivityResult, for the Storage Access Framework picker.
    implementation("androidx.activity:activity-compose:1.9.3")
}
