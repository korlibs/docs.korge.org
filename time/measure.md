---
permalink: /time/measure/
layout: default
group: time
title: "Time Measure"
title_short: Measure
description: "measureTime, measureTimeWithResult & PerformanceCounter"
fa-icon: fa-ruler-horizontal
priority: 40
---

Klock has utilities for mesuring time.

## Measuring Time

As of now, most Klock features have been deprecated in favor of the standard library `kotlin.time`.

### PerformanceCounter

This class offers a performance counter that will increase over time but that cannot be used as reference in time. Only can be used as relative time to compute deltas:

```kotlin
val start: Double = PerformanceCounter.microseconds
// ...
val end: Double = PerformanceCounter.microseconds
val elapsed: TimeSpan = (end - start).microseconds 
```
