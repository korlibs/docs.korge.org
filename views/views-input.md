---
permalink: /views/input/
group: views
layout: default
title: Input
title_prefix: KorGE
fa-icon: fa-gamepad
priority: 30
---
## Input State vs Events

There are two ways of handling input events. One is by checking the input state, and the other is event-based.

### Accessing input state

The `Input` singleton contains the stage of the input values at a time.
It is updated once per frame. You can get it from the `Views` or the `Stage` singletons. 

```kotlin
val input = views.input
```

### Events

KorGE provides a high level API to handle events attaching events to a View.
The events are only triggered when the associated View is attached to the stage.
Views have several extension methods to attach events to them. Which method depends on each kind of event.

## Mouse/Touch Events

### Mouse Input State

```kotlin
view.addUpdater {
    val xy: Point = input.mouse
    val buttons: Int = input.mouseButtons // flags with the pressed buttons
}
``` 

### Mouse Events

You can handle `click`, `over` (hover), `out`, `down`, `downFromOutside`, `up`, `upOutside`, `upAnywhere`, `move`, `moveAnywhere`, `moveOutside` and `exit` mouse events.

For example:

```kotlin
view.mouse {
    click { /*...*/ }
    over { /*...*/ } // hover
    out { /*...*/ }
    down { /*...*/ }
    downFromOutside { /*...*/ }
    up { /*...*/ }
    upOutside { /*...*/ }
    upAnywhere { /*...*/ }
    move { /*...*/ }
    moveAnywhere { /*...*/ }
    moveOutside { /*...*/ }
    exit { /*...*/ }
}
```
or
```kotlin
view.onClick { /*...*/ } // suspending block
```

### Multi-touch Events

```kotlin
view.addUpdater {
    val ntouches: Int = input.activeTouches.size
    val touches: List<Touch> = input.activeTouches
    val rawTouch0: Touch = input.touches[0]
}
``` 

## Keys

### Keys Input State

```kotlin
import com.soywiz.klock.milliseconds
import com.soywiz.klogger.Console
import com.soywiz.korev.Key

view.addUpdater { timespan: TimeSpan ->
    val scale = timespan / 16.milliseconds
    if (input.keys[Key.LEFT]) x -= 2.0 * scale  // Same as `input.keys.pressing(Key.LEFT)`
    if (input.keys.pressing(Key.RIGHT)) x += 2.0 * scale
    if (input.keys.justPressed(Key.ESCAPE)) views.gameWindow.close(0)
    if (input.keys.justReleased(Key.ENTER)) Console.info("I'm working!")
}
```

### Keys Events

To handle any key:

```kotlin
// Matches any key
view.keys {
    down { e -> /*...*/ }
    up { e -> /*...*/ }
}

// Or as a shortcut
view.onKeyUp { e -> /*...*/ } // suspending block
view.onKeyDown { e -> /*...*/ } // suspending block
```

To handle only a specific key event:

```kotlin
// Matches just one key
view.keys {
    // Executes when the key is down. Depending on the platform this might trigger multiple events. Use justDown to trigger it only once.
    down(Key.LEFT) { e -> /*...*/ }
    
    // Executes when the key is up
    up(Key.LEFT) { e -> /*...*/ }

    // Executes on every frame (be aware that fps might vary)
    downFrame(Key.LEFT) { e -> /*...*/ }
    // Executes every 16 milliseconds, when the key is down    
    downFrame(Key.LEFT, 16.milliseconds) { e -> /*...*/ }
    
    // Executes only when the key was pressed once, then it won't be triggered again until released and pressed again
    justDown(Key.LEFT) { e -> /*...*/ }
    
    // Useful for UIs, the code is executed every half a second at first, and then every 100 milliseconds doing an acceleration.
    downRepeating(Key.LEFT) { e -> /*...*/ }
}

```

## Gamepads

### Gamepads Input State

```kotlin
view.addUpdater {
    val gamepads = input.connectedGamepads
    val rawGamepad0 = input.gamepads[0]
    val pressedStart: Boolean = rawGamepad0[GameButton.START]
    val pos: Point = rawGamepad0[GameStick.LEFT]
}
```
### Gamepads Events

```kotlin
view.gamepad {
    val playerId = 0
    connected { playerId -> /*...*/ }
    disconnected { playerId -> /*...*/ }
    stick(playerId, GameStick.LEFT) { x, y -> /*...*/ }
    button(playerId) { pressed, button, value -> /*...*/ }
    down(playerId, GameButton.BUTTON0) { /*...*/ }
}
```

## On stage resizing

Example:

```kotlin
view.onStageResized { width, height ->
	// ...
}

view.onEvent(ViewsResizedEvent) {
}
``` 

## Handling Drag & Drop File Events

It is possible to detect and react to drag & drop events inside KorGE.
To do so, you can handle events of the type `DropFileEvent`.
For simplicity, there is a method you can call from a view to register to DropFileEvent:

```kotlin
val dropFileRect = solidRect(Size(width, height), Colors.RED)
    .visible(false)
onDropFile {
    when (it.type) {
        DropFileEvent.Type.START -> dropFileRect.visible = true
        DropFileEvent.Type.END -> dropFileRect.visible = false
        DropFileEvent.Type.DROP -> {
            launchImmediately {
                it.files?.firstOrNull()?.let {
                    image(it.readBitmap()).size(Size(width, height))
                }
            }
        }
    }
}
```

{% include autoplay_video.html src="/i/file_drag_and_drop.webm" %}

Or if you want to register events directly:

```kotlin
onEvents(DropFileEvent.Type.START) { println("A file is being dragged into the window") }
onEvents(DropFileEvent.Type.DROP) { println("A file has been successfully dropped in the window. Files: ${it.files}") }
onEvents(DropFileEvent.Type.END) { println("The drag&drop finished either with or without drop") }
```

or:

```kotlin
onEvents(*DropFileEvent.Type.ALL) {
    println("${it.type}")
}
```

## Dragging Views

In the case you want to make a view draggable. There is a `View.draggable` and `View.draggableCloseable` extensions:

```kotlin
val solidRect = solidRect(Size(100, 100), Colors.RED)
val closeable = solidRect.draggableCloseable()
```

The Closeable version returns a Closeable instance allowing you to stop accepting the dragging after the close.

{% include autoplay_video.html src="/i/view_dragging.webm" %}

### Configure how dragging works

It is possible to configure the dragging View mediator, like this:

For example if you want only the dragging to work on the X or the Y you can set `autoMove = false`:

```kotlin
val closeable = solidRect.draggableCloseable(selector = solidRect, autoMove = false) { info: DraggableInfo ->
    //info.view.pos = info.viewNextXY
    info.view.x = info.viewNextXY.x
}
```
