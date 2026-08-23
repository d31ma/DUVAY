plugins {
    kotlin("jvm")
}

kotlin { jvmToolchain(17) }

dependencies {
    // kotlinx-serialization would be the idiomatic choice, but the conformance
    // runner only needs to walk a small JSON tree and the repo values a thin
    // dependency graph. org.json ships with the JDK-adjacent test scope only,
    // so a tiny hand-rolled reader is used instead — see ConformanceTest.kt.
    testImplementation(kotlin("test"))
}

tasks.test { useJUnitPlatform() }
