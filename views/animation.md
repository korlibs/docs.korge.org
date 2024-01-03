---
permalink: /views/animation/
group: views
layout: default
title: Animating
title_prefix: KorGE
fa-icon: fa-play
priority: 31
version_review: 5.3.0
---

![](/i/animation.avif)

## while (true) + delay

One way of animation in KorGE is to just make a loop and place a delay.
This method allows you to define complex logic inside the loop and
define state machines just by code. 
(Have in mind that this approach is likely to have some kind of stuttering.)

```kotlin
launchImmediately {
    while (true) {
        view.x++
        delay(16.milliseconds) // suspending
    }
}
```

## addFixedUpdater and addHrUpdater

One way of performing animations with KorGE is by attaching an updater component to
a view. While the view is visible that updater will be executed from time to time.

If you want a code to be executed a number of times per second, you can use addFixedUpdater.
(Have in mind that this approach is likely to have some kind of stuttering.)

```kotlin
view.addFixedUpdater(60.timesPerSecond) {
    x++
}
```

And if your code is designed to support arbitrary time deltas, you can use an updater:
 
```kotlin
view.addUpdater { dt -> // dt contains the delta time using as a TimeSpan inline class instance
    val scale = dt / 16.66666.milliseconds
    x += 2.0 * scale
}
```

## Tweens

Korge integrates tweens and easings, and it is fully integrated with coroutines for your coding pleasure.

Games require tweening visual properties in order to be appealing.
Korge provides a simple, yet powerful interface for creating tweens.

### Simple interface

![](/i/animation.avif)

`View` has an extension method called `View.tween` that allows you to do the magic. And has the following definition:

```
suspend fun View?.tween(vararg vs: V2<*>, time: Int, easing: Easing = Easing.LINEAR, callback: (Double) -> Unit = { })
```

You have to use [bound callable references](https://kotlinlang.org/docs/reference/whatsnew11.html#bound-callable-references) to define properties that will change. And Korge provides some extension methods to bound callable references to generate tween parameters.

If you want to linearly interpolate `view.x` from `10.0` to `100.0` in one second you would write:
```
view.tween(view::x[10.0, 100.0], time = 1000.milliseconds)
```

Or interpolating to a specific position using the current x as the starting value:

```
view.tween(view::x[100.0], time = 1000.milliseconds)
```

> Tip: import `com.soywiz.korge.tween.get` for this to compile. In IntelliJ place the caret in the \[ and press ALT+enter.

### delay + duration + easing

You can control the start time, duration and easing per interpolated property by chaining them in the parameter call, using these V2 extensions:

`V2.delay(timeMs:TimeSpan):V2`, `V2.duration(timeMs:TimeSpan):V2`, `V2.easing(easing:Easing):V2`

```
view.tween(
    view::x[100.0].delay(100.milliseconds).duration(500.milliseconds).easing(Easing.EASE_IN_OUT_QUAD),
    view::y[0.0, 200.0].delay(50.milliseconds),
    time = 1000.milliseconds
)
```

If you want to apply one easing for all subtweens defined in the paramters, just add an extra easing parameter to the `tween` call:

```
view.tween(
    //...
    easing = Easing.EASE_IN
)
```

### Implementation details

The tween execution will be attached as a component to the receiver View that holds the tween method. That means that the view has to be in the stage or be manually updated. Also means that any `View.speed` changes in that view or ancestors will affect the tween.

*PRO Tip:* You can even interpolate the `View.speed` property to get some cool time effects.

## Animator

You can also use an animator, which is almost as flexible as the tweens. Check the [animate sample here](https://github.com/korlibs/korge-samples/blob/master/samples/animations/src/commonMain/kotlin/main.kt)

An animator is an object attached to a view that supports adding `sequence` and `parallel` tweens and actions.
You can create an animator attached to a view with:

```kotlin
val myAnimator = animator()
```

Or with a predefined set of actions:

```kotlin
val myAnimator = animator {
    parallel {
        moveToWithSpeed(view, 500.0, 500.0, 300.0, Easing.EASE_IN_OUT)
        scaleTo(view, 5.0, 5.0)
    }
    parallel {
        moveTo(view, 0.0, 0.0)
    }
    block {
        rotateTo(view, 10.degrees)
    }
}
```

There is also a lazy singleton for views equivalent to `view.animator(parallel = true)` called `view.simpleAnimator`:

```kotlin
view.simpleAnimator
```

Animators can be updated, by adding new elements, and depending of whether it is `parallel` or `sequence`, it will be executed right away, or enqueued to be executed at the end of the animation.

```kotlin
val view = solidRect(100, 100, Colors.BLUE)  

uiButton("Hello").clicked {  
    view.simpleAnimator.moveBy(view, x = +100.0)  
}
```

### Completing an existing animation

In some cases we want to finish the existing animation right away, instead of enqueuing or running an animation in parallel. To do so we have two methods: `cancel()` and `complete()`.

* `cancel()`, cancels the animation not running the rest of the elements and keeping the properties as they are right now.
*  `complete()`, executes all the pending 
Cancelling the animation setting the properties to its final value and executing all the blocks

So for example:

If we execute this code every second, the final `x` position would not be multiple of 100 without jumps in the X:
```kotlin
sequenceAnimator.cancel().moveBy(view, x = +100.0, time = 5.seconds)
```

On the other hand, if we execute this code every second, the final `x` position will be multiple of 100 and there will be a jump in the X:
```kotlin
sequenceAnimator.complete().moveBy(view, x = +100.0, time = 5.seconds)
```

If we don't call either the cancel or complete, and just the moveBy, if the animation is sequential, the operation would be queued:

```kotlin
repeat(5) {
	sequenceAnimator.moveBy(view, x = +100.0, time = 1.seconds)
}
```

If the animation is parallel, the animation will be executed in parallel immediately without stopping other animations, unless the same properties are being updated in which case the latest one will likely prevail, though might have issues.

### Animator operations

Animator provides several operations you can perform in each step:

Tweens: `animator.tween(view::x[0, 100], time = 1.seconds)`

Executing synchronous blocks: `animator.block { println("reached this point") }`

Waiting: `animator.wait(2.seconds)`

Removing a view from its parent: `animator.removeFromParent(view)`

Attaching new sequence or parallel nodes: `animator.sequence { ... }` and `animator.parallel { }`

For example:
```kotlin
val animator1 = animator(parallel = false)  
uiButton("Hello").clicked {  
    animator1.parallel { // try chaing parallel with sequence
        moveBy(view1, x = +100, y = +100)  
        moveBy(view2, x = +100, y = +100)  
    }  
}
```

Moving a view relatively or absolutely to its position:

```kotlin
animator.moveBy(view, x = +10, y = +20)
animator.moveTo(view, x = 100, y = 200)
``` 

Moving a view to a specific position specifying speed instead of time:

```kotlin
animator.moveToWithSpeed(view, x = 200, y = 200, speed = 100.0)
``` 

Moving a view following a path with a time or a speed:

```kotlin
val path = buildVectorPath {  
    line(Point(0, 0), Point(200 + 100, 200))  
    arcTo(Point(100, 100), Point(100, 300), 100.0)  
}  

// Displaying the path
graphics { stroke(Colors.WHITE) { path(path) } }

// Moving around the path
animator.moveInPath(view1, path, time = 2.seconds)
moveInPathWithSpeed(view1, path, speed = { 200.0 }, easing = Easing.LINEAR)

```

Rotating a view relatively or to a specified angle:

```kotlin
animator.rotateBy(+30.degrees)
animator.rotateTo(+30.degrees)
```

Adjusting the alpha of a view:
```kotlin
animator.alpha(view, 0.5)
animator.hide()
animator.show()
```

There are some lazy variants of those methods supporting lambdas instead of values, whose lambdas are executed when the animation is going to start instead of at enqueuing time.

It is also possible to provide `time = ` and `easing = ` parameters to most of the functions provided to specify the duration of the animation and the easing function to use for the properties.
## Awaiting the animation to finish

You can call the `animator.awaitComplete()` suspending function to wait the animation to be completed.
Or register a signal to be executed when the animation is completed:

```kotlin
animator1.onComplete.once { println("completed!") }
```

### A complete Animator example

```kotlin
class MyScene : Scene() {  
    override suspend fun SContainer.sceneMain() {  
        val view1 = solidRect(100, 100, Colors.BLUE).xy(0, 0)  
        val view2 = solidRect(100, 100, Colors.RED).xy(100, 0)  
        val animator1 = animator(parallel = false)  
        uiHorizontalStack {  
            uiButton("Reset").clicked {  
                launchImmediately {  
                    sceneContainer.changeTo { MyScene() }  
                }            }            uiButton("Hello").clicked {  
                animator1.sequence {  
                    parallel {  
                        alpha(view1, 0.5)  
                        alpha(view2, 0.5)  
                    }  
                    parallel {  
                        moveBy(view1, x = +100, y = +100)  
                        moveBy(view2, x = +100, y = +100)  
                    }  
                    sequence {  
                        alpha(view1, 1.0)  
                        alpha(view2, 1.0)  
                    }  
                }            }        }    }  
}
```

### Easings

Korge provides an Easing class with the most common easings. And allows
you to create your own easings.

{% include sample.html sample="EasingsScene" %}

|                             |                             |                          |                            |
|-----------------------------|-----------------------------|--------------------------|----------------------------|
| Easings.EASE_IN_ELASTIC     | Easings.EASE_OUT_ELASTIC    | Easings.EASE_OUT_BOUNCE  | Easings.LINEAR             |
| Easings.EASE_IN             | Easings.EASE_OUT            | Easings.EASE_IN_OUT      | Easings.EASE_OUT_IN        |
| Easings.EASE_IN_BACK        | Easings.EASE_OUT_BACK       | Easings.EASE_IN_OUT_BACK | Easings.EASE_OUT_IN_BACK   |
| Easings.EASE_IN_OUT_ELASTIC | Easings.EASE_OUT_IN_ELASTIC | Easings.EASE_IN_BOUNCE   | Easings.EASE_IN_OUT_BOUNCE |
| Easings.EASE_OUT_IN_BOUNCE  | Easings.EASE_IN_QUAD        | Easings.EASE_OUT_QUAD    | Easings.EASE_IN_OUT_QUAD   |
{:.small}

## ANI/SWF Files

KorGE supports SWF animation files by a kproject module available in the store. For more details check it here: <https://docs.korge.org/store_proxy/?url=/module/korge-swf/#>
## Video-tutorial

{% include youtube.html video_id="ebW4Hr97h_I" %}

