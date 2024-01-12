---
permalink: /views/tile-maps/
group: views
layout: default
title: Tile Maps
title_prefix: KorGE
fa-icon: fa-map
priority: 100
status: incomplete
version_review: 5.3.0
---
KorGE supports TileMaps and TileSets. This feature supports drawing a matrix with a lot of similar elements in equidistant positions in a grid, including rendering only the elements visible in the screen.
It can be used standalone or via [Tiled](https://docs.korge.org/store_proxy/?url=/module/korge-tiled/), [LDtk](https://docs.korge.org/store_proxy/?url=/module/korge-ldtk/#) or other tile engines implemented in KorGE.
## Basic Support

KorGE supports tilesets and sparse stackable/layered tilemaps and offset support. That serves as a foundation for other Tile engines to be implemented like Tiled or LDtk. Those engines are provided in the store as separate libraries.

There are three separate concepts: `TileSet`, `IStackedIntArray2` and `TileMap`.

## `TileSet`

TileSet, as its name implies, is a set of tiles of a fixed size. A tile is a small image of a fixed size. Each tile can be displayed zero or more times in the grid of a TileMap. They are identified by an integer, associates an image (typically a slice inside a TileSet Atlas), and optionally provides collision information and a list of `TileSetAnimationFrame` referencing other tiles + a duration.

```kotlin
class TileSet(  
	val tilesMap: IntMap<TileSetTileInfo>,
	val width: Int, val height: Int,
) {
	val tileSize: SizeInt get() = SizeInt(width, height)
}

data class TileSetTileInfo(  
	val id: Int,
	val slice: BmpSlice,
	val frames: List<TileSetAnimationFrame> = emptyList(),
	val collision: TileShapeInfo? = null,
) : Extra

data class TileSetAnimationFrame(
	val tileId: Int,
	val duration: TimeSpan
)
``` 

## `IStackedIntArray2`

This interface implemented by `SparseChunkedStackedIntArray2`  and `StackedIntArray2`, is a bidimensional integer array that supports arbitrary number of layers for each cell.

```kotlin
interface IStackedIntArray2 {
	val width: Int  
	val height: Int
	
	/** The [empty] value that will be returned if the specified cell it out of bounds, or empty */
	val empty: Int  
	/** The maximum level of layers available on the whole stack */  
	val maxLevel: Int

	operator fun set(x: Int, y: Int, level: Int, value: Int)  
	operator fun get(x: Int, y: Int, level: Int): Int
	
	/** Number of values available at this [x], [y] */
	fun getStackLevel(x: Int, y: Int): Int  
  
	/** Adds a new [value] on top of [x], [y] */
	fun push(x: Int, y: Int, value: Int)  
  
	/** Removes the last value at [x], [y] */
	fun removeLast(x: Int, y: Int)}

	// ...
}
```

These integers represent the IDs (or rather the numeric representation of `TileInfo`) in the TileSet. So each cell in the grid has zero or more attributed tiles associated to it.

## `TileMapRepeat`

Represents how the TileMap is going to be rendered outside its bounds. 

```kotlin
enum class TileMapRepeat {
	/* Nothing will be displayed outside the tilemap bounds */
    NONE,  
	/* The content will be repeated: so 0, 1, 2, 3 ... 0, 1, 2, 3 */
    REPEAT,  
	/* The content will be mirrored: so 0, 1, 2, 3 ... 2, 1, 0 */
    MIRROR,
}
```

## Building a map

```kotlin
val array = StackedIntArray2(20, 15)
```

For tiles without properties:

```kotlin
array.push(0, 0, 10)
```

For tiles with properties (displacement, rotation and/or flipping):

```kotlin
array.push(0, 0, TileInfo(tile = 0, offsetX = 0, offsetY = 0, flipX = 
false, flipY = false, rotate = false).data)
```

### Building sparse maps

For very big maps where only a few segments are defined, it is possible to use `SparseChunkedStackedIntArray2`:

```kotlin
val sparse = SparseChunkedStackedIntArray2()  
val chunk1 = StackedIntArray2(16, 16, startX = -100, startY = -100)  
val chunk2 = StackedIntArray2(16, 16, startX = -50, startY = 50)  
sparse.putChunk(chunk1)  
sparse.putChunk(chunk2)
```

## `TileInfo`

TileInfo wraps an Integer and it is the actual value used in the TileMap's `IStackedIntArray2`. Though since an array of inline classes would be boxed, integers are used internally.
Each TileInfo contains the `tile` (ID), an `offsetX`/`offsetY`, whether it is `rotate`d, or flipped in the X or Y `flipX` / `flipY`.
Since TileInfo is wrapped with a 32-bit `Int` it allocates some bit for each property.
So:
* `tile` ID can be one value between 0 and 262143 (18 bits)
* `offsetX` and `offsetY` can represent values between 0 and 31 (5 bits each one).
* `rotate`, `flipX` and `flipY` are boolean flags

The `-1` raw value is considered an invalid `TileInfo`.
Rotation flags map the ones in the [Tiled specification](https://doc.mapeditor.org/en/latest/reference/global-tile-ids/#tile-flipping).

```kotlin
inline class TileInfo(val data: Int) {  
    val isValid: Boolean get() = data != -1  
    val isInvalid: Boolean get() = data == -1  
  
    val tile: Int get() = data.extract(0, 18)  
    val offsetX: Int get() = data.extract5(18)  
    val offsetY: Int get() = data.extract5(23)  
    val rotate: Boolean get() = data.extract(29)  
    val flipY: Boolean get() = data.extract(30)  
    val flipX: Boolean get() = data.extract(31)
  
    constructor(tile: Int, offsetX: Int = 0, offsetY: Int = 0, flipX: Boolean = false, flipY: Boolean = false, rotate: Boolean = false) : this(0  
        .insert(tile, 0, 18)  
        .insert(offsetX, 18, 5).insert(offsetY, 23, 5)  
        .insert(rotate, 29).insert(flipY, 30).insert(flipX, 31)  
    )  
  
}
```

## `TileMap`

`TileMap` is a `View` class that renders a `IStackedIntArray2` using a `TileSet` to interpret those integers (`TileInfo`) as actual images, displayed from the grid, rotated or flipped based on the TileInfo representation of those integers. There is a `repeatX` and `repeatY` property using the `TileMapRepeat` enum to describe how to render the grid outside the bounds of the array.

Since internally TileMap caches all the tiles, to ensure tiles are rendered upon update, we have to call `tileMap.lock { /* modification of the used stackedIntMap */ }` when we modify the stackable grid of tiles (stackedIntMap). Other than that it is a normal View. It performs automatically occlusion testing of the grid to render only what it is required.

```kotlin
inline fun Container.tileMap(  
    map: IStackedIntArray2,  
    tileset: TileSet,  
    repeatX: TileMapRepeat = TileMapRepeat.NONE,  
    repeatY: TileMapRepeat = repeatX,  
    smoothing: Boolean = true,  
    tileSize: SizeInt = tileset.tileSize,  
    callback: @ViewDslMarker TileMap.() -> Unit = {},  
) = TileMap(map, tileset, smoothing, tileSize).repeat(repeatX, repeatY).addTo(this, callback)
```

```kotlin
class TileMap(  
    var stackedIntMap: IStackedIntArray2 | IntArray2 = StackedIntArray2(1, 1, 0), 
    var tileset: TileSet = TileSet.EMPTY,  
    var smoothing: Boolean = true,  
    var tileSize: SizeInt = tileset.tileSize,  
) : View() {
	// Repeating mode
	var repeatX = TileMapRepeat.NONE  
	var repeatY = TileMapRepeat.NONE
	fun repeat(repeatX: TileMapRepeat, repeatY: TileMapRepeat = repeatX): TileMap

	// In the case we use offseting of tiles, we might want to increase this number
	var overdrawTiles: Int = 0
	
	// Locking
	fun lock()
	fun unlock()
	inline fun <T> lock(block: () -> T): T
}
```