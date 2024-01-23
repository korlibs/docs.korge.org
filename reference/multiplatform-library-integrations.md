---
permalink: /multiplatform-library-integrations/
group: reference
layout: default
title: Multiplatform Library Integrations
title_prefix: KorGE
fa-icon: fa-cubes
priority: 100
---
Kotlin and KorGE support multiple targets. Each target might use different per-platform or native libraries for each platform. In order to unify that functionality into a common API, Kotlin provides a `expect` & `actual` mechanism. It is possible to either use Kotlin Multiplatform libraries that do this for you, or by also using functionality from the store doing this, or by doing it ourselves for a specific functionality.

You can read further [details about expect/actual in the official Kotlin documentation](https://kotlinlang.org/docs/multiplatform-expect-actual.html).

## `src/commonMain/kotlin` expect

The first thing is to provide a `expect` declaration in the common source set (can be functions, global properties, objects, classes and interfaces):

```kotlin
package my.services

expect object Achivements {
	fun show()
}
```

## `build.gradle.kts` Per platform dependencies if required:

For each platform that we want to support, we can provide zero or more dependencies just only for that target. For example the firebase sdk or similar. This works the same as a normal Kotlin Multiplatform project:

```kotlin
korge {
	// ...
}

dependencies {
	// For Kotlin Multiplatform libraries 
	add("commonMain", "...")

	// For normal per platform libraries
	add("androidMain", "...")
	add("jsMain", "...")
	add("jvmMain", "...")
	add("iosMain", "...")
}
```

## `src/androidMain/kotlin` , `src/jvmMain/kotlin`, `src/jsMain/kotlin` actual:

Then in the same package and typically in the same file with a suffix like `myfile.android.kt`, we provide an actual implementation:

```kotlin
package my.services

actual object Achivements {
	fun show() {
		// call
		TODO("Not implemented")
	}
}
```

All targets must have directly or indirectly an `actual` implementation. It is recommended to start with an initial `TODO()` for all the targets and then implement them one by one by using the libraries there were included or by using native functionality for that platform.

As an advice, it is better to start simple and then add functionality as required.
