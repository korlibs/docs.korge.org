---
permalink: /targets/
group: targets
layout: default
title: "Deployment"
title_prefix: KorGE & Gradle Plugin
children: /korge/deployment/
fa-icon: fa-mobile
priority: 0
version_review: 5.2.0
---

KorGE supports several desktop, web, and mobile targets.
In this section you will find details for each supported target.

The KorGE Gradle Plugin is the in handle of exposing all the tasks
that allow to run and build the targets.

Its development happens here: <https://github.com/korlibs/korge/tree/main/korge-gradle-plugin>{:target="_blank",:rel="noopener"}

## The `korge` extension

The korge extension is a DSL to configure the application.
For further reference you can find the source code [here](https://github.com/korlibs/korge/blob/f41005e8894855f31296b5100d9878ab05a26c70/buildSrc/src/main/kotlin/korlibs/korge/gradle/KorgeExtension.kt#L84).

```kotlin
korge {
    id = "com.unknown.unknownapp"
    version = "0.0.1"
    exeBaseName = "app"
    name = "unnamed"
    description = "description"
    orientation = Orientation.DEFAULT
    copyright = "Copyright (c) 2019 Unknown"

    // Configuring the author
    authorName = "unknown"
    authorEmail = "unknown@unknown"
    authorHref = "http://localhost"
    author("name", "email", "href")

    icon = File(rootDir, "icon.png")

    gameCategory = GameCategory.ACTION
    fullscreen = true
    backgroundColor = 0xff000000.toInt()
    appleDevelopmentTeamId = java.lang.System.getenv("DEVELOPMENT_TEAM") ?: project.findProperty("appleDevelopmentTeamId")?.toString()
    appleOrganizationName = "User Name Name"
    entryPoint = "main"
    jvmMainClassName = "MainKt"
    androidMinSdk = null

    //androidAppendBuildGradle("...code...")
    config("MYPROP", "MYVALUE")

    // Korge Plugins
    plugin("com.soywiz:korge-admob:$korgeVersion", mapOf("ADMOB_APP_ID" to ADMOB_APP_ID))
    admob(ADMOB_APP_ID) // Shortcut for admob
}
```

## Project structure

Four small files (plus Gradle 8.5) is all you need to get started:

### `gradle/libs.versions.toml`

```toml
[plugins]  
korge = { id = "com.soywiz.korge", version = "5.2.0" }  
#korge = { id = "com.soywiz.korge", version = "999.0.0.999" }
```

### `settings.gradle.kts`

This is a template, that works like this to get the korge version from `libs.versions.toml` since version catalogs are not available in the settings buildscript.

```kotlin
pluginManagement {  
    repositories { mavenLocal(); mavenCentral(); google(); gradlePluginPortal() }  
}  
  
buildscript {  
    val libsTomlFile = File(this.sourceFile?.parentFile, "gradle/libs.versions.toml").readText()  
    var plugins = false  
    var version = ""  
    for (line in libsTomlFile.lines().map { it.trim() }) {  
        if (line.startsWith("#")) continue  
        if (line.startsWith("[plugins]")) plugins = true  
        if (plugins && line.startsWith("korge") && Regex("^korge\\s*=.*").containsMatchIn(line)) version = Regex("version\\s*=\\s*\"(.*?)\"").find(line)?.groupValues?.get(1) ?: error("Can't find korge version")  
    }  
    if (version.isEmpty()) error("Can't find korge version in $libsTomlFile")  
  
    repositories { mavenLocal(); mavenCentral(); google(); gradlePluginPortal() }  
  
    dependencies {  
        classpath("com.soywiz.korge.settings:com.soywiz.korge.settings.gradle.plugin:$version")  
    }  
}  
  
apply(plugin = "com.soywiz.korge.settings")
```

### `build.gradle.kts`

In this file you include and configure the KorGE Gradle plugin.

The plugin does:

* Choose and configure the right supported `kotlin-multiplatform`. At this point, it uses `{{ site.data.versions.kotlin }}`.
* Include all the artifacts required for KorGE.
* Add tasks to compile, install and run all the supported targets by the platform.
* Enable an extension called `korge` where you can configure properties of your application (application title, id, icon...)

```kotlin
import korlibs.korge.gradle.*  
  
plugins {  
    alias(libs.plugins.korge)  
}  
  
korge {  
    id = "com.sample.demo"  
  
// To enable all targets at once  
  
    //targetAll()  
// To enable targets based on properties/environment variables  
    //targetDefault()  
// To selectively enable targets  
    targetJvm()  
    targetJs()  
    targetDesktop()  
    targetIos()  
    targetAndroid()  
    targetWasm()  
  
    serializationJson()  
}  

dependencies {  
    add("commonMainApi", project(":deps"))  
    //add("commonMainApi", project(":korge-dragonbones"))  
}
```

### src/commonMain/kotlin

All your common source files must be stored here.
If you want to have specific source files per platform, you can use the directory structure of Kotlin-Common.
For example: `src/androidMain/kotlin`, `src/jsMain/kotlin`, `src/jvmMain/kotlin`, `src/iosX64/kotlin`...

#### src/commonMain/kotlin/main.kt

KorGE requires the entry point to be a `suspend fun main` function without arguments. In most of the targets, this function is called directly. But in Android and iOS, this main will be called after from an `Activity` or a `ViewController`.
All these details are handled by the KorGE gradle plugin.

```kotlin
suspend fun main() = Korge {
	sceneContainer().changeTo { MyScene() }

}

class MyScene : Scene() {  
    override suspend fun SContainer.sceneMain() {  
		solidRect(100, 100, Colors.RED)
    }  
}
```

## Gradle Tasks

In addition to all the low-level tasks offered by the `kotlin-multiplatform` plugin, KorGE offers additional tasks:

For Windows, change all the `./gradlew` for `gradlew.bat`.

The most basic task to run your application is `./gradlew runJvmAutoreload`, that will recompile and update the current Scene code on every code change automatically.

For the rest of the tasks and details for each platform, check the [Targets section](/targets):
