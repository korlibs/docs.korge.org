---
permalink: /math/fixedpoint/
group: math
layout: default
title: Fixed Point
title_short: Fixed Point
description: Package for dealing with Big Numbers both integral and decimal
fa-icon: fa-sort-numeric-up
priority: 200
version_review: 5.3.0
---
## Fixed Point Arithmetic

The `Float` and `Double` types serve for handling numbers with decimals. Though its variable precision (there is more density in representable numbers in the 0-1 range, and then quickly decreases) sometime lead to inconsistencies or problems. So for simulations for example, the same parameters and operations might lead to different values in an Intel, AMD, ARM device or with SIMD optimizations.

Fixed Point arithmetic circumvents that problem by implementing deterministically arithmetic with plain integer arithmetic, representing some bits as the integral part and others for the decimal part.

## `Fixed`, `FixedLong` and `FixedShort`

`Fixed` in decimal it has precision of:* +-9999999.99 integer digits, 2 decimal digits.  1 bit for sign, 23~24 bits of integer, 6~7 bits of decimal

```kotlin
inline val Number.fixed: Fixed
val String.fixed: Fixed
```

`FixedLong` in decimal it has precision of:* +-99999999999999.9999, 14 integer digits, 4 decimal digits.  1 bit for sign, 47~48 bits of integer, 14~15 bits of decimal

```kotlin
inline val Number.fixedLong: FixedLong
val String.fixedLong: FixedLong
```

`FixedShort` in decimal it has precision of:* +-3275.9, 3.3 integer digits, 1 decimal digit. 1 bit for sign, 11~12 bits of integer, 3~5 bits of decimal

```kotlin
fun String.toFixedShort(): FixedShort
inline fun Number.toFixedShort(): FixedShort
```
