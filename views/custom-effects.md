## Implementing a Motion Blur effect

KorGE provides a `DirectionalBlurFilter` that allows to specify a direction and amplitude for the blurring. With a small decorator that detects and computes the view movement speed and angle creating and attaching an `addUpdater` to the view, it can determine which amount and direction for the filter to apply in every moment.

Demo preview:

![Motion Blur](/i/motion-blur.webm)

Demo code:

```kotlin
import korlibs.image.color.*  
import korlibs.io.lang.*  
import korlibs.korge.*  
import korlibs.korge.scene.*  
import korlibs.korge.tween.*  
import korlibs.korge.view.*  
import korlibs.korge.view.filter.*  
import korlibs.math.*  
import korlibs.math.geom.*  
import korlibs.time.*  
import kotlin.math.*  
  
suspend fun main() = Korge { sceneContainer().changeTo { MyScene() } }  
  
class MyScene : Scene() {  
    override suspend fun SContainer.sceneMain() {  
        val view = circle(16.0, fill = Colors.RED).xy(100, 100)  
        view.motionBlur(scale = 2.0, exp = 0.75)  
        while (true) {  
            tween(view::x[300], view::y[300], time = 1.seconds)  
            tween(view::x[100], view::y[300], time = 1.seconds)  
            tween(view::x[100], view::y[100], time = 1.seconds)  
        }  
    }  
}  
  
fun View.motionBlur(scale: Double = 5.0, exp: Double = 0.75, min: Double = 0.0, max: Double = 20.0): Cancellable {  
    val view = this  
    val filter = DirectionalBlurFilter()  
    this.addFilter(filter)  
    var now = Point()  
    var last = Point()  
    last = view.pos  
    val updater = addUpdater {  
        val timeScale = 16.milliseconds / it  
        now = view.pos  
        if (now != last) {  
            filter.angle = Angle.between(last, now)  
            filter.radius = (Point.distance(last, now) * scale * timeScale).pow(exp).clamp(min, max)  
        } else {  
            filter.radius = 0.0  
        }  
        last = now  
    }  
    return Cancellable {  
        this.removeFilter(filter)  
        updater.cancel()  
    }  
}
```
