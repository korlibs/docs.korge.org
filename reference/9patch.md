---
permalink: /9patch/
group: reference
layout: default
title: 9-Patch
fa-icon: fas fa-th
priority: 35
---

9-Patches (nine patches) allow to create images that can be resized without getting distorted. KorGE supports 9-patches images from intellij/android, 9-patches from AseSprite, and manually creating 9-patches from code.
Number nine comes from 9 sections that appear after splitting the x axis two times and the y axis another two times, with the center section scaling and the sides not scaling.

KorGE implementation supports an arbitrary number of fixed and scalable sections for each axe, from 1 section to N.
## 9-patches from IntelliJ (`.9.png`)

IntelliJ 9 patches can be created directly in the IDE. They have the `.9.png` extension. From a base image, by right-clicking, you can click on the `create 9-patch file` action, then dragging the borders of the image, you can define the parts of the image that should be keep unscaled or not, in the X and Y axes.
![](/i/9patch-noaudio.webm)By code, to read a nine patch, you can use:

```kotlin
ninePatch(resourcesVfs["roundrect.9.png"].readNinePatch()).xy(0, 32)
```

And when setting the size (width and height), the borders will be kept as expected.

And using it in code looks like this:
![](/i/Pasted%20image%2020240115113603.png)
![](/i/9patch-use.webm)That `.9.png` is just a plan image that has an extra border of 1 pixel on top, left, right and bottom, defining the scalable sections by axis, and content sections, like this:
![](/i/Pasted%20image%2020240115112442.png)
 
> Note that content information is currently not implemented, but will be implemented in future versions.

## Creating 9-patches programmatically 

It is possible from a plain BitmapSlice, to create a NinePatch from it (with `.asNinePatchSimple` for pixel coordinates, or `.asNinePatchSimpleRatio` for ratio inside the slice):

```kotlin
val ninepatch = resourcesVfs["roundrect.png"]  
    .readBitmapSlice()
    // .asNinePatchSimple(10, 10, 40, 40)
    .asNinePatchSimpleRatio(left = 0.25, top = 0.25, right = 0.75, bottom = 0.75)
```

![](/i/Pasted%20image%2020240115121526.png)
In the case the full functionality from 9-patches is needed (multiple scalable sections), it is possible to use the main constructor:
```kotlin
val slice = resourcesVfs["roundrect.png"].readBitmapSlice()  
 
ninePatch(NinePatchBmpSlice(  
    slice,  
    NinePatchInfo(  
        xranges = listOf(  
            false to (0 until 12),  
            true to (12 until 20),  
            false to (20 until 32),  
        ),  
        yranges = listOf(  
            false to (0 until 12),  
            true to (12 until 20),  
            false to (20 until 32),  
        ),  
        width = 32, height = 32,  
        content = slice  
    )  
))
	.xy(50, 50)
	.size(200, 200)
```
## 9-patches from AseSprite

Starting with KorGE 5.3.1, `.ase` nine patches are also supported. Slices support setting 9-slice bounds as explained in the [Aseprite documentation for 9-patch](https://www.aseprite.org/docs/slices/#slice-properties) by providing bounds manually, or after created, by dragging. In the case of AseSprite 9-patches are limited to those 9 sections, and no content area can be provided.

![](/i/Pasted%20image%2020240115114443.png)

Then by code you can:
```kotlin
val ninepatch = resourcesVfs["roundrect.ase"]  
    .readImageData(ASE).frames.first().first?.ninePatchSlice  
ninePatch(ninepatch).xy(50, 50).size(200, 200)
```

![](/i/Pasted%20image%2020240115115526.png)
