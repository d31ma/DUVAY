// DuVay gallery — an internal dev and snapshot-test harness.
//
// Explicitly out of scope as a product per CROSS-PLATFORM-PLAN.md: it is not
// shipped, documented or supported as a starter. It exists because a native
// widget library cannot be developed or screenshot-tested without a host app.

plugins {
    id("com.android.application")
    kotlin("android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "ma.del.duvay.gallery"
    compileSdk = 35

    defaultConfig {
        applicationId = "ma.del.duvay.gallery"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures { compose = true }
    buildTypes {
        getByName("debug") { isMinifyEnabled = false }
    }
}

kotlin { jvmToolchain(17) }

dependencies {
    implementation(project(":duvay-compose"))
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.compose.material:material-icons-extended")
}
