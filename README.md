#Index

**Modules**

* [Config](#module_Config)
  * [Config.WIDTH](#module_Config.WIDTH)
  * [Config.HEIGHT](#module_Config.HEIGHT)
  * [Config.TITLE](#module_Config.TITLE)
  * [Config.VERSION](#module_Config.VERSION)
  * [Config.ROOM_TILE_WIDTH](#module_Config.ROOM_TILE_WIDTH)
  * [Config.ROOM_TILE_HEIGHT](#module_Config.ROOM_TILE_HEIGHT)
  * [Config.ROOM_WIDTH](#module_Config.ROOM_WIDTH)
  * [Config.ROOM_HEIGHT](#module_Config.ROOM_HEIGHT)
  * [Config.TILE_SIZE](#module_Config.TILE_SIZE)
* [ItemFactory](#module_ItemFactory)
  * [ItemFactory~generateItem()](#module_ItemFactory..generateItem)
* [LoadingState](#module_LoadingState)
  * [LoadingState.preload()](#module_LoadingState.preload)
  * [LoadingState.create()](#module_LoadingState.create)
  * [LoadingState.update()](#module_LoadingState.update)
* [PlayState](#module_PlayState)
  * [PlayState.preload()](#module_PlayState.preload)
  * [PlayState.create()](#module_PlayState.create)
  * [PlayState.initWorld()](#module_PlayState.initWorld)
  * [PlayState.update()](#module_PlayState.update)
* [MapUtils](#module_MapUtils)
  * [MapUtils.addBackground(offsetX, offsetY, state)](#module_MapUtils.addBackground)
  * [MapUtils~carveEntrances(x, y, offsetX, offsetY, state, map)](#module_MapUtils..carveEntrances)
  * [MapUtils~findFurthestRoom()](#module_MapUtils..findFurthestRoom)
  * [MapUtils~populateRooms(offsetX, offsetY)](#module_MapUtils..populateRooms)
  * [MapUtils~addBoundaries(x, y, offsetX, offsetY)](#module_MapUtils..addBoundaries)

**Classes**

* [class: Player](#Player)
  * [new Player(game, _x, _y)](#new_Player)
  * [player.initProjectiles()](#Player#initProjectiles)
  * [player.enablePhysics(game)](#Player#enablePhysics)
  * [player.fire(game)](#Player#fire)
  * [player.pickUp(item)](#Player#pickUp)
  * [player.handleUpdate(game)](#Player#handleUpdate)
* [class: MapFactory](#MapFactory)
  * [new MapFactory()](#new_MapFactory)
  * [mapFactory.generate(game, _difficulty)](#MapFactory#generate)
  * [mapFactory.checkInBounds(x, y)](#MapFactory#checkInBounds)
* [class: RoomFactory](#RoomFactory)
  * [new RoomFactory()](#new_RoomFactory)
  * [roomFactory.initRooms(game)](#RoomFactory#initRooms)
  * [roomFactory.selectRandom()](#RoomFactory#selectRandom)
* [class: Inventory](#Inventory)
  * [new Inventory(size)](#new_Inventory)
  * [inventory.drop(slot)](#Inventory#drop)
  * [inventory.add(item, slot)](#Inventory#add)
  * [inventory.useItem(slot)](#Inventory#useItem)
  * [inventory.findEmptySlot()](#Inventory#findEmptySlot)
  * [inventory.getItemInSlot(slot)](#Inventory#getItemInSlot)
  * [inventory.list()](#Inventory#list)
* [class: Item](#Item)
  * [new Item(game, x, y, _name, _description)](#new_Item)
  * [item.enablePhysics(game)](#Item#enablePhysics)

**Members**

* [enum: Direction](#Direction)
  * [Direction.NORTH](#Direction.NORTH)
  * [Direction.SOUTH](#Direction.SOUTH)
  * [Direction.EAST](#Direction.EAST)
  * [Direction.WEST](#Direction.WEST)
 
<a name="module_Config"></a>
#Config
Configuration object, used for constants
across the application

**Members**

* [Config](#module_Config)
  * [Config.WIDTH](#module_Config.WIDTH)
  * [Config.HEIGHT](#module_Config.HEIGHT)
  * [Config.TITLE](#module_Config.TITLE)
  * [Config.VERSION](#module_Config.VERSION)
  * [Config.ROOM_TILE_WIDTH](#module_Config.ROOM_TILE_WIDTH)
  * [Config.ROOM_TILE_HEIGHT](#module_Config.ROOM_TILE_HEIGHT)
  * [Config.ROOM_WIDTH](#module_Config.ROOM_WIDTH)
  * [Config.ROOM_HEIGHT](#module_Config.ROOM_HEIGHT)
  * [Config.TILE_SIZE](#module_Config.TILE_SIZE)

<a name="module_Config.WIDTH"></a>
##Config.WIDTH
<a name="module_Config.HEIGHT"></a>
##Config.HEIGHT
<a name="module_Config.TITLE"></a>
##Config.TITLE
<a name="module_Config.VERSION"></a>
##Config.VERSION
<a name="module_Config.ROOM_TILE_WIDTH"></a>
##Config.ROOM_TILE_WIDTH
<a name="module_Config.ROOM_TILE_HEIGHT"></a>
##Config.ROOM_TILE_HEIGHT
<a name="module_Config.ROOM_WIDTH"></a>
##Config.ROOM_WIDTH
<a name="module_Config.ROOM_HEIGHT"></a>
##Config.ROOM_HEIGHT
<a name="module_Config.TILE_SIZE"></a>
##Config.TILE_SIZE
<a name="module_ItemFactory"></a>
#ItemFactory
Simple factory to generate test items,
might well be destroyed in favour of
an item database.

**Read only**: true  
<a name="module_ItemFactory..generateItem"></a>
##ItemFactory~generateItem()
Generates a simple test item

**Scope**: inner function of [ItemFactory](#module_ItemFactory)  
**Returns**: [Item](#Item)  
<a name="module_LoadingState"></a>
#LoadingState
state to handle preloading of assets for use
throughout the rest of the game. at present
just handles everything upfront, but could
use moving to specific states.

**Extends**: `Phaser.State`  
**Members**

* [LoadingState](#module_LoadingState)
  * [LoadingState.preload()](#module_LoadingState.preload)
  * [LoadingState.create()](#module_LoadingState.create)
  * [LoadingState.update()](#module_LoadingState.update)

<a name="module_LoadingState.preload"></a>
##LoadingState.preload()
Preload step for the loading state.

<a name="module_LoadingState.create"></a>
##LoadingState.create()
Create state, called to create the preloadBar and stuff
like that.

<a name="module_LoadingState.update"></a>
##LoadingState.update()
Update state, in this case used to update the progress bar,
then progress to the main play state if complete.

<a name="module_PlayState"></a>
#PlayState
Main game loop state

**Extends**: `Phaser.State`  
**Members**

* [PlayState](#module_PlayState)
  * [PlayState.preload()](#module_PlayState.preload)
  * [PlayState.create()](#module_PlayState.create)
  * [PlayState.initWorld()](#module_PlayState.initWorld)
  * [PlayState.update()](#module_PlayState.update)

<a name="module_PlayState.preload"></a>
##PlayState.preload()
Called on loading of the state, before
anything else

<a name="module_PlayState.create"></a>
##PlayState.create()
Called when creating the play state after preloading
of assets is already handled.

<a name="module_PlayState.initWorld"></a>
##PlayState.initWorld()
Initialises the world, generates the map and populates
room tiles procedurally.

<a name="module_PlayState.update"></a>
##PlayState.update()
Main update function to handle updates to object
or class properties, not anything visual.

<a name="module_MapUtils"></a>
#MapUtils
Set of utility functions for map generation

**Members**

* [MapUtils](#module_MapUtils)
  * [MapUtils.addBackground(offsetX, offsetY, state)](#module_MapUtils.addBackground)
  * [MapUtils~carveEntrances(x, y, offsetX, offsetY, state, map)](#module_MapUtils..carveEntrances)
  * [MapUtils~findFurthestRoom()](#module_MapUtils..findFurthestRoom)
  * [MapUtils~populateRooms(offsetX, offsetY)](#module_MapUtils..populateRooms)
  * [MapUtils~addBoundaries(x, y, offsetX, offsetY)](#module_MapUtils..addBoundaries)

<a name="module_MapUtils.addBackground"></a>
##MapUtils.addBackground(offsetX, offsetY, state)
Add a background to the given room

**Params**

- offsetX `Number`  
- offsetY `Number`  
- state `Phaser.State`  

<a name="module_MapUtils..carveEntrances"></a>
##MapUtils~carveEntrances(x, y, offsetX, offsetY, state, map)
carveEntrances

**Params**

- x `Number`  
- y `Number`  
- offsetX `Number`  
- offsetY `Number`  
- state `Phaser.State`  
- map `Array`  

**Scope**: inner function of [MapUtils](#module_MapUtils)  
<a name="module_MapUtils..findFurthestRoom"></a>
##MapUtils~findFurthestRoom()
Finds the furthest room from the spawn location,
well, ok, it finds one of the rooms at the furthest
point.

**Scope**: inner function of [MapUtils](#module_MapUtils)  
**Returns**: `Phaser.Point`  
<a name="module_MapUtils..populateRooms"></a>
##MapUtils~populateRooms(offsetX, offsetY)
Populates the room in the empty map based on a
pre-generated room layout from Tiled.

**Params**

- offsetX `Number` - Current room offset x  
- offsetY `Number` - Current room offset y  

**Scope**: inner function of [MapUtils](#module_MapUtils)  
<a name="module_MapUtils..addBoundaries"></a>
##MapUtils~addBoundaries(x, y, offsetX, offsetY)
Checks neighbours of the current cell and sees if a boundary
wall should be drawn, to stop the player leaving the map.

**Params**

- x `Number` - Current room x coordinate  
- y `Number` - Current room y coordinate  
- offsetX `Number` - Pixel offset for room  
- offsetY `Number` - Pixel offset for room  

**Scope**: inner function of [MapUtils](#module_MapUtils)  
<a name="Player"></a>
#class: Player
**Extends**: `Phaser.Sprite`  
**Members**

* [class: Player](#Player)
  * [new Player(game, _x, _y)](#new_Player)
  * [player.initProjectiles()](#Player#initProjectiles)
  * [player.enablePhysics(game)](#Player#enablePhysics)
  * [player.fire(game)](#Player#fire)
  * [player.pickUp(item)](#Player#pickUp)
  * [player.handleUpdate(game)](#Player#handleUpdate)

<a name="new_Player"></a>
##new Player(game, _x, _y)
Represents the player. Whilst not a singleton,
should be treated as such anyway because of reasons.

**Params**

- game `Phaser.Game` - The current game  
- _x `float` - The x coordinate to spawn player  
- _y `float` - The y coordinate to spawn player  

**Extends**: `Phaser.Sprite`  
<a name="Player#initProjectiles"></a>
##player.initProjectiles()
Sets up the physics and spawns 50 spare projectiles
that can be killed, cached, and used for firing as
opposed to creating each one on the fly.

<a name="Player#enablePhysics"></a>
##player.enablePhysics(game)
Sets up the player sprite to use
arcade physics and configures gravity,
bounce, and the like.

**Params**

- game `Phaser.Game` - The current game  

<a name="Player#fire"></a>
##player.fire(game)
Fires a projectile at the mouse pointer

**Params**

- game `Phaser.Game` - The current game  

<a name="Player#pickUp"></a>
##player.pickUp(item)
Called on collision with a consumable,
adds the item to the inventory in the first
available slot

**Params**

- item <code>[Item](#Item)</code>  

<a name="Player#handleUpdate"></a>
##player.handleUpdate(game)
Player's update method as update() is taken by
the parent class, Phaser.Sprite.

**Params**

- game `Phaser.Game` - The current game  

<a name="MapFactory"></a>
#class: MapFactory
**Members**

* [class: MapFactory](#MapFactory)
  * [new MapFactory()](#new_MapFactory)
  * [mapFactory.generate(game, _difficulty)](#MapFactory#generate)
  * [mapFactory.checkInBounds(x, y)](#MapFactory#checkInBounds)

<a name="new_MapFactory"></a>
##new MapFactory()
Utility class with helper methods for
generating maps

<a name="MapFactory#generate"></a>
##mapFactory.generate(game, _difficulty)
Generates a map layout based on an arbitrary difficulty
parameter. This parameter affects the size of the level
and also the number of steps taken, though it is still
pretty random.

**Params**

- game `Phaser.Game` - The current game  
- _difficulty `Number` - Difficulty value  

**Returns**: `Array` - Two dimensional array representing a map  
<a name="MapFactory#checkInBounds"></a>
##mapFactory.checkInBounds(x, y)
Helper function to quickly check if the selected
coordinate is within the bounds of the map

**Params**

- x `Number`  
- y `Number`  

**Returns**: `Boolean`  
<a name="RoomFactory"></a>
#class: RoomFactory
**Members**

* [class: RoomFactory](#RoomFactory)
  * [new RoomFactory()](#new_RoomFactory)
  * [roomFactory.initRooms(game)](#RoomFactory#initRooms)
  * [roomFactory.selectRandom()](#RoomFactory#selectRandom)

<a name="new_RoomFactory"></a>
##new RoomFactory()
Static class representing tools for
room generation;

<a name="RoomFactory#initRooms"></a>
##roomFactory.initRooms(game)
Adds Tiled json files to the possible room pool

**Params**

- game `Phaser.Game` - Current game  

<a name="RoomFactory#selectRandom"></a>
##roomFactory.selectRandom()
Generates a room layout for the current world represented
by a two dimensional array;

**Returns**: `Array` - Two dimensional array representing a map  
<a name="Inventory"></a>
#class: Inventory
**Members**

* [class: Inventory](#Inventory)
  * [new Inventory(size)](#new_Inventory)
  * [inventory.drop(slot)](#Inventory#drop)
  * [inventory.add(item, slot)](#Inventory#add)
  * [inventory.useItem(slot)](#Inventory#useItem)
  * [inventory.findEmptySlot()](#Inventory#findEmptySlot)
  * [inventory.getItemInSlot(slot)](#Inventory#getItemInSlot)
  * [inventory.list()](#Inventory#list)

<a name="new_Inventory"></a>
##new Inventory(size)
Creates an inventory to handle both what items
are collected / dropped / destroyed but also
which slot they exist in for the ui.

**Params**

- size `Number` - Size of the inventory to create  

<a name="Inventory#drop"></a>
##inventory.drop(slot)
Drop the item in the specified slot

**Params**

- slot `Number`  

**Returns**: `undefined`  
<a name="Inventory#add"></a>
##inventory.add(item, slot)
Add item to specified slot, or first available
if not specified

**Params**

- item <code>[Item](#Item)</code>  
- slot `Number`  

<a name="Inventory#useItem"></a>
##inventory.useItem(slot)
Activates the item in the selected slot

**Params**

- slot `Number`  

**Returns**: `undefined`  
<a name="Inventory#findEmptySlot"></a>
##inventory.findEmptySlot()
Finds the first available empty slot.

**Returns**: `Number`  
<a name="Inventory#getItemInSlot"></a>
##inventory.getItemInSlot(slot)
Returns the item found in the specified slot.

**Params**

- slot `Number`  

**Returns**: [Item](#Item)  
<a name="Inventory#list"></a>
##inventory.list()
List all items in the inventory

**Returns**: `undefined`  
<a name="Item"></a>
#class: Item
**Members**

* [class: Item](#Item)
  * [new Item(game, x, y, _name, _description)](#new_Item)
  * [item.enablePhysics(game)](#Item#enablePhysics)

<a name="new_Item"></a>
##new Item(game, x, y, _name, _description)
Item

**Params**

- game `Phaser.Game` - the current game  
- x `Number` - spawn x coordinate  
- y `Number` - spawn y coordinate  
- _name `String` - item name  
- _description `String` - item description  

<a name="Item#enablePhysics"></a>
##item.enablePhysics(game)
enablePhysics

**Params**

- game `Phaser.Game`  

<a name="Direction"></a>
#enum: Direction
Assigning indexes to cardinal directions

**Properties**: `NORTH`, `SOUTH`, `EAST`, `WEST`  
**Read only**: true  
