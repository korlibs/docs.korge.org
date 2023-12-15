---
permalink: /views/debug/
group: views
layout: default
title: Debug
title_prefix: KorGE
fa-icon: fa-bug
priority: 36
version_review: 5.2.0
---

Sometimes it is hard to figure out what's going on when the views doesn't look as expected.
Other times we want to adjust stuff or to get specific properties from views.

By pressing **F7**, you can check mouse events, and on the JVM there is an extra debug window
where you can check the view tree and the properties of each view.

![](/i/debug.avif)

## Debug annotations

### `@ViewProperty`

![](/i/ViewPropertyAnnotation.avif)

In order for a View property to appear in the JVM debug panel, we should annotate the property with the `@ViewProperty` annotation. For numbers, it is possible to specify the basic range, and if the value can be clamped or not among other properties.

```kotlin
@ViewProperty(min = 0.0, max = 1.0)
var scaleXY: Scale

@ViewProperty(min = 0.0, max = 1.0, clampMin = false, clampMax = false, decimalPlaces = 2, groupName = "properties", order = 0, editable = true)
var scaleXY: Scale
```

If we annotate a method without arguments with ViewProperty, it will be appear as a button:

```kotlin
@ViewProperty
fun simulateWin() { }
@ViewProperty
fun simulateLose() { }
@ViewProperty
fun simulateTie() { }
```

Supported types: `Pair<*, *>`, `Point`, `Size`, `Scale`, `Margin`, `Spacing`, `Anchor`, `Vector3`, `IntRange`, `RectCorners`, `Ratio`, `Double`, `Float`, `Int`, `Boolean`, `Angle`, `String`, `RGBA`, `RichTextData`, `ViewActionList`, `Enum`...
## `@ViewPropertySubTree`

If we want one or more objects to appear individually in the debug panel:

```kotlin
@ViewProperty  
@ViewPropertySubTree  
val filters: FastArrayList<Filter>,
```
## `@ViewPropertyFileRef`

In some cases, we might want to allow the user to select a file. We can use the `@ViewPropertyFileRef` annotation in such cases:

```kotlin
@ViewProperty  
@ViewPropertyFileRef(["png", "jpg"])  
private var imageSourceFile: String? by this::sourceFile
```

## `@ViewPropertyProvider`

In some cases we want to provide a list of possible values for example for a string or an inline class.

```kotlin
@ViewProperty  
@ViewPropertyProvider(TextAlignmentProvider::class)  
var textAlignment: TextAlignment = TextAlignment.TOP_LEFT

object TextAlignmentProvider : ViewPropertyProvider.ItemsImpl<TextAlignment>() {  
    override val ITEMS: List<TextAlignment> get() = TextAlignment.ALL  
}
```

## Hot reloading annotations

### `@KeepOnReload` annotation

When using hot reloading, we can mark some `Scene` properties to be persisted between reloads. To do so, we annotate it with the `@KeepOnReload` annotation:

```kotlin
class MyScene : Scene() {
	@KeepOnReload
	var pos = Point(100, 100)
	
	override fun SContainer.sceneMain() {
		println(pos) // 100, 100 first time and 200, 200 after modying and refreshing.
		pos = Point(200, 200)
	}
}
``` 