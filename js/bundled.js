(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Config = require("./conf/Config").Config;
var LoadingState = require("./states/LoadingState").LoadingState;
var PlayState = require("./states/PlayState").PlayState;


/**
 * Bootstrap the game. For the purpose of
 * debugging, the game itself is applied
 * to the window object, but eventually
 * this will fall off and just sit within
 * it's own scope.
 */
window.onload = function () {
    "use strict";
    document.title = Config.TITLE + " v" + Config.VERSION;
    window.g = new Phaser.Game(Config.WIDTH, Config.HEIGHT, Phaser.CANVAS, document.getElementById("viewport"), null, false, false);
    window.g.state.add("load", LoadingState);
    window.g.state.add("play", PlayState);
    window.g.state.start("load");
};

},{"./conf/Config":3,"./states/LoadingState":12,"./states/PlayState":13}],2:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Inventory = require("../items/Inventory").Inventory;
var Journal = require("../quest/Journal").Journal;


/**
 * Represents the player. Whilst not a singleton,
 * should be treated as such anyway because of reasons.
 *
 * @constructor
 * @extends {Phaser.Sprite}
 * @param {Phaser.Game} game - The current game
 * @param {float} _x - The x coordinate to spawn player
 * @param {float} _y - The y coordinate to spawn player
 */
var Player = exports.Player = (function (_Phaser$Sprite) {
    function Player(game, x, y) {
        _classCallCheck(this, Player);

        _get(Object.getPrototypeOf(Player.prototype), "constructor", this).call(this, game, x, y, "test_sprite");
        this.jumpSpeed = 350;
        this.movementSpeed = 250;
        this.fire_cooldown = 0;
        this.fireRate = 400;
        this.projectiles = game.add.group();
        this.projectileSpeed = 400;
        this.baseGravity = 450;
        this.hasWalljumped = false;
        this.inventory = new Inventory(12);
        this.journal = new Journal();

        this.enablePhysics(game);
        this.initProjectiles();
    }

    _inherits(Player, _Phaser$Sprite);

    _prototypeProperties(Player, null, {
        initProjectiles: {


            /**
             * Sets up the physics and spawns 50 spare projectiles
             * that can be killed, cached, and used for firing as
             * opposed to creating each one on the fly.
             *
             * @method
             */
            value: function initProjectiles() {
                this.projectiles.enableBody = true;
                this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
                this.projectiles.createMultiple(50, "test_sprite_small");
                this.projectiles.setAll("checkWorldBounds", true);
                this.projectiles.setAll("outOfBoundsKill", true);
            },
            writable: true,
            configurable: true
        },
        enablePhysics: {


            /**
             * Sets up the player sprite to use
             * arcade physics and configures gravity,
             * bounce, and the like.
             *
             * @method
             * @param {Phaser.Game} game - The current game
             */
            value: function enablePhysics(game) {
                game.physics.arcade.enable(this);
                this.body.bounce.y = 0;
                this.body.allowGravity = true;
                this.body.gravity.y = this.baseGravity;
                this.anchor.setTo(0.5, 0);
                this.body.collideWorldBounds = true;
            },
            writable: true,
            configurable: true
        },
        fire: {


            /**
             * Fires a projectile at the mouse pointer
             *
             * @method
             * @param {Phaser.Game} game - The current game
             */
            value: function fire(game) {
                if (game.time.now > this.fire_cooldown && this.projectiles.countDead() > 0) {
                    this.fire_cooldown = game.time.now + this.fireRate;
                    var projectile = this.projectiles.getFirstDead();
                    projectile.reset(this.x, this.y);
                    projectile.rotation = game.physics.arcade.angleToPointer(projectile);
                    game.physics.arcade.moveToPointer(projectile, this.projectileSpeed);
                }
            },
            writable: true,
            configurable: true
        },
        pickUp: {


            /**
             * Called on collision with a consumable,
             * adds the item to the inventory in the first
             * available slot
             *
             * @method
             * @param {Item} item
             */
            value: function pickUp(item) {
                "use strict";
                this.inventory.add(item);
            },
            writable: true,
            configurable: true
        },
        handleUpdate: {


            /**
             * Player's update method as update() is taken by
             * the parent class, Phaser.Sprite.
             *
             * @method
             * @param {Phaser.Game} game - The current game
             */
            value: function handleUpdate(game) {
                this.body.velocity.x = 0;

                if (game.input.activePointer.isDown) {
                    this.fire(game);
                }

                if (this.body.blocked.left || this.body.blocked.right) {
                    this.body.gravity.y = 50;
                } else {
                    this.body.gravity.y = this.baseGravity;
                    this.hasWalljumped = false;
                }

                if (this.body.blocked.left && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.hasWalljumped) {
                    this.body.velocity.y = -this.jumpSpeed;
                    this.body.velocity.x = this.movementSpeed;
                    this.hasWalljumped = true;
                }

                if (this.body.blocked.right && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.hasWalljumped) {
                    this.body.velocity.y = -this.jumpSpeed;
                    this.body.velocity.x = -this.movementSpeed;
                    this.hasWalljumped = true;
                }

                if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                    this.body.velocity.x = -this.movementSpeed;
                }
                if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                    this.body.velocity.x = this.movementSpeed;
                }
                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.body.onFloor()) {
                    this.body.velocity.y = -this.jumpSpeed;
                }
            },
            writable: true,
            configurable: true
        }
    });

    return Player;
})(Phaser.Sprite);



module.exports = Player;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../items/Inventory":8,"../quest/Journal":10}],3:[function(require,module,exports){
"use strict";

var tileSize = 32;
var roomWidth = 40;
var roomHeight = 20;

/**
 * Configuration object, used for constants
 * across the application
 *
 * @module Config
 */
var Config = exports.Config = {
  /**
   * @attribute {Number} WIDTH - Width of the canvas
   */
  WIDTH: 960,
  /**
   * @attribute {Number} HEIGHT - Height of the canvas
   */
  HEIGHT: 540,
  /**
   * @attribute {String} TITLE - Window title
   */
  TITLE: "proto",
  /**
   * @attribute {String} VERSION - Application version
   */
  VERSION: "0.0.0",
  /**
   * @attribute {Number} ROOM_TILE_WIDTH - Rooms are how many tiles wide?
   */
  ROOM_TILE_WIDTH: roomWidth,
  /**
   * @attribute {Number} ROOM_TILE_HEIGHT - Rooms are how many tiles high?
   */
  ROOM_TILE_HEIGHT: roomHeight,
  /**
   * @attribute {Number} ROOM_SIZE - Size of a room
   */
  ROOM_WIDTH: tileSize * roomWidth,
  /**
   * @attribute {Number} ROOM_HEIGHT - Size of a room
   */
  ROOM_HEIGHT: tileSize * roomHeight,
  /**
   * @attribute {Number} TILE_SIZE - Size of a single tile
   */
  TILE_SIZE: tileSize
};
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}],4:[function(require,module,exports){
"use strict";

/**
 * Enumerator of all item types
 *
 * @enum
 * @readonly
 */
var ItemType = exports.ItemType = {
  ARMOUR: 0,
  WEAPON: 1,
  SPELL: 2,
  CONSUMABLE: 3
};
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}],5:[function(require,module,exports){
"use strict";

var Item = require("../items/Item").Item;


/**
 * Simple factory to generate test items,
 * might well be destroyed in favour of
 * an item database.
 *
 * @module ItemFactory
 * @readonly
 */
var ItemFactory = exports.ItemFactory = {
  /**
   * Generates a simple test item
   *
   * @inner
   * @return {Item}
   */
  generateItem: function (game, x, y) {
    "use strict";
    return new Item(game, x, y, "Test item", "This is a test item.");
  }
};
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"../items/Item":9}],6:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Assigning indexes to cardinal directions
 *
 * @enum
 * @readonly
 */
var Direction = {
    NORTH: 0,
    SOUTH: 1,
    EAST: 2,
    WEST: 3
};

/**
 * Utility class with helper methods for
 * generating maps
 *
 * @constructor
 */
var MapFactory = exports.MapFactory = (function () {
    function MapFactory(game) {
        _classCallCheck(this, MapFactory);

        this.map = [];
    }

    _prototypeProperties(MapFactory, null, {
        generate: {


            /**
             * Generates a map layout based on an arbitrary difficulty
             * parameter. This parameter affects the size of the level
             * and also the number of steps taken, though it is still
             * pretty random.
             *
             * @param {Phaser.Game} game - The current game
             * @param {Number} _difficulty - Difficulty value
             * @return {Array} Two dimensional array representing a map
             */
            value: function generate(game, _difficulty) {
                var difficulty = _difficulty;
                var steps = difficulty * 5;

                // Initialise the arrays to the correct size
                for (var y = 0; y < difficulty; y++) {
                    this.map[y] = [];
                    for (var x = 0; x < difficulty; x++) {
                        this.map[y][x] = undefined;
                    }
                }

                var position = new Phaser.Point(Math.floor(Math.random() * this.map[0].length), Math.floor(Math.random() * this.map.length));

                game.spawnRoom = position;

                for (var i = 0; i < steps; i++) {
                    switch (Math.floor(Math.random() * 4)) {
                        case Direction.NORTH:
                            if (this.checkInBounds(position.x, position.y - 1)) {
                                position.y -= 1;
                            }
                            break;
                        case Direction.SOUTH:
                            if (this.checkInBounds(position.x, position.y + 1)) {
                                position.y += 1;
                            }
                            break;
                        case Direction.EAST:
                            if (this.checkInBounds(position.x + 1, position.y)) {
                                position.x += 1;
                            }
                            break;
                        case Direction.WEST:
                            if (this.checkInBounds(position.x - 1, position.y)) {
                                position.x -= 1;
                            }
                            break;
                    }
                    this.map[position.y][position.x] = 1;
                }
                return this.map;
            },
            writable: true,
            configurable: true
        },
        checkInBounds: {


            /**
             * Helper function to quickly check if the selected
             * coordinate is within the bounds of the map
             *
             * @param {Number} x
             * @param {Number} y
             * @return {Boolean}
             */
            value: function checkInBounds(x, y) {
                return x > 0 && y > 0 && x < this.map[0].length && y < this.map.length;
            },
            writable: true,
            configurable: true
        }
    });

    return MapFactory;
})();
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}],7:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Config = require("../conf/Config").Config;


/**
 * Static class representing tools for
 * room generation;
 *
 * @constructor
 */
var RoomFactory = exports.RoomFactory = (function () {
    function RoomFactory() {
        _classCallCheck(this, RoomFactory);

        this.rooms = [];
        this.initRooms();
    }

    _prototypeProperties(RoomFactory, null, {
        initRooms: {


            /**
             * Adds Tiled json files to the possible room pool
             *
             * @param {Phaser.Game} game - Current game
             */
            value: function initRooms(game) {
                this.rooms.push([[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]);
            },
            writable: true,
            configurable: true
        },
        selectRandom: {


            /**
             * Generates a room layout for the current world represented
             * by a two dimensional array;
             *
             * @return {Array} Two dimensional array representing a map
             */
            value: function selectRandom() {
                var rand = Math.floor(Math.random() * this.rooms.length);
                return this.rooms[rand];
            },
            writable: true,
            configurable: true
        }
    });

    return RoomFactory;
})();
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../conf/Config":3}],8:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ItemType = require("../enums/ItemType").ItemType;


/**
 * Creates an inventory to handle both what items
 * are collected / dropped / destroyed but also
 * which slot they exist in for the ui.
 *
 * @constructor
 * @param {Number} size - Size of the inventory to create
 */
var Inventory = exports.Inventory = (function () {
    function Inventory(size) {
        _classCallCheck(this, Inventory);

        // Yeah, correct the size for 0 indexing
        this.size = size - 1;
        this.items = new Array(size - 1);
        this.weight = 0;
        this._item_buffer = undefined;
    }

    _prototypeProperties(Inventory, null, {
        drop: {


            /**
             * Drop the item in the specified slot
             *
             * @method
             * @param {Number} slot
             * @return {undefined}
             */
            value: function drop(slot) {
                if (!slot) {
                    throw new Error("No slot defined, cannot drop item.");
                }
                var item = this.items[slot];
                this.items[slot] = undefined;
                return item;
            },
            writable: true,
            configurable: true
        },
        add: {


            /**
             * Add item to specified slot, or first available
             * if not specified
             *
             * @method
             * @param {Item} item
             * @param {Number} slot
             */
            value: function add(item, slot) {
                if (!item) {
                    throw new Error("Cannot add item to inventory as no item supplied.");
                }
                if (!slot) {
                    var s = this.findEmptySlot();
                    if (s !== null) {
                        this.items[s] = item;
                    } else {
                        console.log("No free slot found, inventory full!");
                    }
                } else {
                    if (slot > this.size) {
                        throw new Error("Attempted to add item to slot " + slot + " but that is beyond the inventory size.");
                    }
                    if (this.items[slot] !== undefined) {
                        throw new Error("Cannot add item to slot " + slot + " as there is already an item there.");
                    } else {
                        this.items[slot] = item;
                    }
                }
            },
            writable: true,
            configurable: true
        },
        useItem: {


            /**
             * Activates the item in the selected slot
             *
             * @method
             * @param {Number} slot
             * @return {undefined}
             */
            value: function useItem(slot) {
                try {
                    var item = this.getItemInSlot(slot);
                    if (item.type === ItemType.CONSUMABLE) {
                        console.log("it's a consumable");
                    } else if (item.type === ItemType.ARMOUR) {
                        console.log("it's armour");
                    } else if (item.type === ItemType.WEAPON) {
                        console.log("it's a weapon");
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            writable: true,
            configurable: true
        },
        findEmptySlot: {


            /**
             * Finds the first available empty slot.
             *
             * @method
             * @return {Number}
             */
            value: function findEmptySlot() {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i] === undefined) {
                        return i;
                    }
                }
                return null;
            },
            writable: true,
            configurable: true
        },
        getItemInSlot: {


            /**
             * Returns the item found in the specified slot.
             *
             * @method
             * @param {Number} slot
             * @return {Item}
             */
            value: function getItemInSlot(slot) {
                if (!this.items[slot]) {
                    throw new Error("No item found in slot " + slot);
                } else {
                    return this.items[slot];
                }
            },
            writable: true,
            configurable: true
        },
        list: {


            /**
             * List all items in the inventory
             *
             * @method
             * @todo - make this do something
             * @return {undefined}
             */
            value: function list() {
                console.log(this.items);
            },
            writable: true,
            configurable: true
        }
    });

    return Inventory;
})();
exports["default"] = Inventory;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../enums/ItemType":4}],9:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Item
 *
 * @constructor
 * @param {Phaser.Game} game - the current game
 * @param {Number} x - spawn x coordinate
 * @param {Number} y - spawn y coordinate
 * @param {String} _name - item name
 * @param {String} _description - item description
 */
var Item = exports.Item = (function (_Phaser$Sprite) {
    function Item(game, x, y, name, description) {
        _classCallCheck(this, Item);

        _get(Object.getPrototypeOf(Item.prototype), "constructor", this).call(this, game, x, y, "test_sprite_small");
        this.name = name;
        this.description = description;

        this.enablePhysics(game);
    }

    _inherits(Item, _Phaser$Sprite);

    _prototypeProperties(Item, null, {
        enablePhysics: {


            /**
             * enablePhysics
             *
             * @method
             * @param {Phaser.Game}
             */
            value: function enablePhysics(game) {
                game.physics.arcade.enable(this);
                this.body.bounce.y = 0.5;
                this.body.gravity.y = 300;
                this.anchor.setTo(0.5, 0.5);
            },
            writable: true,
            configurable: true
        }
    });

    return Item;
})(Phaser.Sprite);
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}],10:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Quest = require("./Quest").Quest;
var Journal = exports.Journal = (function () {
    function Journal() {
        _classCallCheck(this, Journal);

        this.quests = {
            open: [],
            failed: [],
            completed: []
        };
        this.journal = [];
    }

    _prototypeProperties(Journal, null, {
        addEntry: {
            value: function addEntry(text) {
                this.journal.push(text);
            },
            writable: true,
            configurable: true
        },
        getJournal: {
            value: function getJournal() {
                for (var i = this.journal.length - 1; i >= 0; i--) {
                    console.log(this.journal[i]);
                }
            },
            writable: true,
            configurable: true
        },
        addQuest: {
            value: function addQuest(quest) {
                if (quest.journalEntry !== null) {
                    this.addEntry(quest.journalEntry);
                }
                this.quests.open.push(quest);
            },
            writable: true,
            configurable: true
        },
        findQuestIndexById: {
            value: function findQuestIndexById(id) {
                var index = null;
                for (var i = 0; i < this.quests.open.length; i++) {
                    if (this.quests.open[i].id === id) {
                        index = i;
                    }
                }
                return index;
            },
            writable: true,
            configurable: true
        },
        completeQuest: {
            value: function completeQuest(id) {
                if (!id) {
                    throw new Error("You must supply an id for a quest to complete.");
                }
                var index = this.findQuestIndexById(id);
                if (index === null) {
                    throw new Error("Cannot complete quest with id \"" + id + "\" as it is not found.");
                }
                this.quests.open[index].complete();
                this.quests.completed.push(this.quests.open[index]);
                this.quests.open.splice(index, 1);
            },
            writable: true,
            configurable: true
        },
        failQuest: {
            value: function failQuest(id) {
                if (!id) {
                    throw new Error("You must supply an id for a quest to fail.");
                }
                var index = this.findQuestIndexById(id);
                if (index === null) {
                    throw new Error("Cannot fail quest with id \"" + id + "\" as it is not found.");
                }
                this.quests.open[index].fail();
                this.quests.failed.push(this.quests.open[index]);
                this.quests.open.splice(index, 1);
            },
            writable: true,
            configurable: true
        }
    });

    return Journal;
})();
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"./Quest":11}],11:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var QuestUtil = require("../util/QuestUtil").QuestUtil;
var Quest = exports.Quest = (function () {
    function Quest(name, description, xpReward, itemReward, journalEntry) {
        _classCallCheck(this, Quest);

        this.name = name;
        this.description = description;
        this.xpReward = xpReward;
        this.itemReward = itemReward ? itemReward : null;
        this.journalEntry = journalEntry ? journalEntry : null;
        this.id = QuestUtil.generateQuestId(this.name);
    }

    _prototypeProperties(Quest, null, {
        complete: {
            value: function complete() {
                console.log("completed quest: ", this);
            },
            writable: true,
            configurable: true
        },
        fail: {
            value: function fail() {
                console.log("failed quest: ", this);
            },
            writable: true,
            configurable: true
        }
    });

    return Quest;
})();
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../util/QuestUtil":16}],12:[function(require,module,exports){
"use strict";

var Config = require("../conf/Config").Config;


/**
 * state to handle preloading of assets for use
 * throughout the rest of the game. at present
 * just handles everything upfront, but could
 * use moving to specific states.
 * 
 * @module LoadingState
 * @extends Phaser.State
 */
var LoadingState = exports.LoadingState = {


    /**
     * Preload step for the loading state.
     *
     * @attribute {Function}
     */
    preload: function () {
        "use strict";
        this.load.bitmapFont("bitmap_font", "assets/ui/font.png", "assets/ui/font.xml");
        this.load.image("test_sprite", "assets/sprites/test_sprite.png");
        this.load.image("test_sprite_small", "assets/sprites/test_sprite_small.png");
        this.load.image("test_tileset", "assets/tilesets/test_tileset.png");
        this.load.image("test_background", "assets/backgrounds/test_background.png");
    },


    /**
     * Create state, called to create the preloadBar and stuff
     * like that.
     *
     * @attribute {Function}
     */
    create: function () {
        "use strict";

        this.text = this.game.add.bitmapText(Config.WIDTH / 2, Config.HEIGHT - 40, "bitmap_font", "Loading", 12);
        this.text.align = "center";
        this.text.fixedToCamera = true;
    },


    /**
     * Update state, in this case used to update the progress bar,
     * then progress to the main play state if complete.
     *
     * @attribute {Function}
     */
    update: function () {
        "use strict";
        if (this.game.load.progress === 100) {
            this.text.destroy();
            this.state.start("play");
        }
    }
};
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../conf/Config":3}],13:[function(require,module,exports){
"use strict";

var Config = require("../conf/Config").Config;
var Player = require("../characters/Player").Player;
var MapFactory = require("../factories/MapFactory").MapFactory;
var MapUtils = require("../util/MapUtils").MapUtils;
var ItemFactory = require("../factories/ItemFactory").ItemFactory;
var TestUI = require("../ui/ReactTest").TestUI;


/**
 * Main game loop state
 * 
 * @module PlayState
 * @extends Phaser.State
 */
var PlayState = exports.PlayState = {

    /**
     * Called on loading of the state, before
     * anything else
     *
     * @attribute {Function}
     */
    preload: function () {
        "use strict";
        this.initWorld();
    },

    /**
     * Called when creating the play state after preloading
     * of assets is already handled.
     *
     * @attribute {Function}
     */
    create: function () {
        "use strict";
        this.player = new Player(this, this.game.spawnRoom.x * Config.ROOM_WIDTH + 64, this.game.spawnRoom.y * Config.ROOM_HEIGHT + 64);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);

        this.test = new TestUI(this.player);

        // Ideally this needs to go somewhere, not sure where yet.
        this.dustEmitter = this.game.add.emitter(0, 0, 100);
        this.dustEmitter.makeParticles("test_sprite_small");
        this.dustEmitter.bounce.y = 0.4;
        this.dustEmitter.alpha = 0.3;
        this.dustEmitter.gravity = 250;

        this.collectables = this.game.add.group();
        this.collectables.enableBody = true;
        this.collectables.add(this.item);
    },


    /**
     * Initialises the world, generates the map and populates
     * room tiles procedurally.
     *
     * @todo This takes forever, need to offload it to the preload
     * @todo This really needs abstracting, it's getting huge
     * state or something.
     * @attribute {Function}
     */
    initWorld: function () {
        "use strict";
        var _this = this;

        var mapFactory = new MapFactory(this.game);

        var map = mapFactory.generate(this.game, 5);

        this.world = {};
        this.world.map = this.game.add.tilemap();
        this.world.map.addTilesetImage("test_tileset");
        this.world.layer = this.world.map.create("test", map[0].length * Config.ROOM_TILE_WIDTH, map.length * Config.ROOM_TILE_HEIGHT, Config.TILE_SIZE, Config.TILE_SIZE);
        this.world.layer.resizeWorld();
        this.world.map.setCollision(1, true, this.world.layer);
        this.world.map.fill(1, 0, 0, map[0].length * Config.ROOM_TILE_WIDTH, map.length * Config.ROOM_TILE_HEIGHT, "test");
        this.world.furthest = MapUtils.findFurthestRoom(this, map);

        var xx = this.world.furthest.x * Config.ROOM_WIDTH + 60;
        var yy = this.world.furthest.y * Config.ROOM_HEIGHT + 60;

        this.item = ItemFactory.generateItem(this.game, xx, yy);

        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1) {
                    MapUtils.populateRooms(x * Config.ROOM_TILE_WIDTH, y * Config.ROOM_TILE_HEIGHT, this);
                    MapUtils.carveEntrances(x, y, x * Config.ROOM_TILE_WIDTH, y * Config.ROOM_TILE_HEIGHT, this, map);
                }
            }
        }
    },


    /**
     * Main update function to handle updates to object
     * or class properties, not anything visual.
     * 
     * @attribute {Function}
     */
    update: function () {
        "use strict";
        var _this = this;

        this.test.render(this.player);

        this.game.physics.arcade.collide(this.player, this.world.layer);
        this.game.physics.arcade.collide(this.player.projectiles, this.world.layer, function (projectile) {
            _this.dustEmitter.x = projectile.x;
            _this.dustEmitter.y = projectile.y;
            _this.dustEmitter.start(true, 2000, null, 10);
            projectile.kill();
        });

        this.game.physics.arcade.collide(this.player, this.collectables, function (player, collectable) {
            player.pickUp(collectable);
            collectable.destroy();
        });

        this.player.handleUpdate(this);
        this.game.physics.arcade.collide(this.dustEmitter, this.world.layer);

        this.game.physics.arcade.collide(this.collectables, this.world.layer);
    } };
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../characters/Player":2,"../conf/Config":3,"../factories/ItemFactory":5,"../factories/MapFactory":6,"../ui/ReactTest":14,"../util/MapUtils":15}],14:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TestUI = exports.TestUI = (function () {
    function TestUI(player) {
        _classCallCheck(this, TestUI);

        this.viewport = document.getElementById("ui-viewport");
        this.value = player.position.x;

        this.test = React.createClass({
            displayName: "test",
            render: function () {
                return React.createElement(
                    "div",
                    null,
                    "hello there"
                );
            }
        });
    }

    _prototypeProperties(TestUI, null, {
        render: {
            value: function render(player) {
                this.value = player.position.x;
                React.render(this.test, this.viewport);
            },
            writable: true,
            configurable: true
        }
    });

    return TestUI;
})();
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}],15:[function(require,module,exports){
"use strict";

var RoomFactory = require("../factories/RoomFactory").RoomFactory;
var Config = require("../conf/Config").Config;


/**
 * Set of utility functions for map generation
 *
 * @module MapUtils
 */
var MapUtils = exports.MapUtils = {

    roomFactory: new RoomFactory(),


    /**
     * Add a background to the given room
     *
     * @param {Number} offsetX
     * @param {Number} offsetY
     * @param {Phaser.State} state
     */
    addBackground: function addBackground(offsetX, offsetY, state) {
        "use strict";
        var bg = state.game.add.tileSprite(offsetX * Config.TILE_SIZE, offsetY * Config.TILE_SIZE, 1280, 640, "test_background");
    },


    /**
     * carveEntrances
     *
     * @inner
     * @param {Number} x
     * @param {Number} y
     * @param {Number} offsetX
     * @param {Number} offsetY
     * @param {Phaser.State} state
     * @param {Array} map
     */
    carveEntrances: function carveEntrances(x, y, offsetX, offsetY, state, map) {
        "use strict";

        var mapTop = y - 1 >= 0 ? map[y - 1][x] : undefined;
        var mapLeft = x - 1 >= 0 ? map[y][x - 1] : undefined;

        if (mapTop !== undefined) {
            var width = Math.floor(Math.random() * (6 - 3) + 3);
            var start = Math.floor(Math.random() * (37 - 2) + 2);
            for (var i = 0; i < width; i++) {
                state.world.map.putTile(2, offsetX + start + i, offsetY, "test");
                state.world.map.putTile(2, offsetX + start + i, offsetY - 1, "test");
            }
        }

        if (mapLeft !== undefined) {
            var pos = Math.random() > 0.5 ? 1 : 16;
            for (var ii = 0; ii < 3; ii++) {
                state.world.map.putTile(2, offsetX, offsetY + pos + ii, "test");
                state.world.map.putTile(2, offsetX - 1, offsetY + pos + ii, "test");
            }
        }
    },


    /**
     * Finds the furthest room from the spawn location,
     * well, ok, it finds one of the rooms at the furthest
     * point.
     *
     * @inner
     * @return {Phaser.Point}
     */
    findFurthestRoom: function findFurthestRoom(state, map) {
        "use strict";
        var max = 0;
        var furthest = null;
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (map[y][x] !== undefined && (x !== state.game.spawnRoom.x && y !== state.game.spawnRoom.y)) {
                    var dist = Math.abs(x - state.game.spawnRoom.x) + Math.abs(y - state.game.spawnRoom.y);
                    if (dist > max) {
                        max = dist;
                        furthest = new Phaser.Point(x, y);
                    }
                }
            }
        }
        return furthest;
    },


    /**
     * Populates the room in the empty map based on a
     * pre-generated room layout from Tiled.
     *
     * @inner
     * @param {Number} offsetX - Current room offset x
     * @param {Number} offsetY - Current room offset y
     */
    populateRooms: function populateRooms(offsetX, offsetY, state) {
        "use strict";
        var room = this.roomFactory.selectRandom();
        for (var y = 0; y < Config.ROOM_TILE_HEIGHT; y++) {
            for (var x = 0; x < Config.ROOM_TILE_WIDTH; x++) {
                state.world.map.putTile(room[y][x], offsetX + x, offsetY + y, "test");
            }
        }
    },


    /**
     * Checks neighbours of the current cell and sees if a boundary
     * wall should be drawn, to stop the player leaving the map.
     *
     * @inner
     * @param {Number} x - Current room x coordinate
     * @param {Number} y - Current room y coordinate
     * @param {Number} offsetX - Pixel offset for room
     * @param {Number} offsetY - Pixel offset for room
     */
    addBoundaries: function addBoundaries(map, x, y, offsetX, offsetY, game) {
        "use strict";
        // Check top
        if (y - 1 < 0 || map[y - 1][x] === undefined) {
            for (var i = 0; i < Config.ROOM_TILE_WIDTH; i++) {
                game.world.map.putTile(1, offsetX + i, offsetY, "test");
            }
        }

        // check bottom
        var mapBot = y + 1 < map.length ? map[y + 1][x] : undefined;
        if (y + 1 > Config.ROOM_TILE_HEIGHT || y + 1 > map.length || mapBot === undefined) {
            for (var ii = 0; ii < Config.ROOM_TILE_WIDTH; ii++) {
                game.world.map.putTile(1, offsetX + ii, offsetY + Config.ROOM_TILE_HEIGHT - 1);
            }
        }

        // check left
        if (x - 1 < 0 || map[y][x - 1] === undefined) {
            for (var iii = 0; iii < Config.ROOM_TILE_HEIGHT; iii++) {
                game.world.map.putTile(1, offsetX, offsetY + iii);
            }
        }

        // check right
        var mapRight = x + 1 < map[y].length ? map[y][x + 1] : undefined;
        if (x + 1 > Config.ROOM_TILE_WIDTH || x + 1 > map[0].length || mapRight === undefined) {
            for (var iv = 0; iv < Config.ROOM_TILE_HEIGHT; iv++) {
                game.world.map.putTile(1, offsetX + Config.ROOM_TILE_WIDTH - 1, offsetY + iv);
            }
        }
    }
};
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"../conf/Config":3,"../factories/RoomFactory":7}],16:[function(require,module,exports){
"use strict";

var QuestUtil = exports.QuestUtil = {
    generateQuestId: function (seed) {
        "use strict";
        var id = "q-";
        for (var i = 0; i < seed.length; i++) {
            id += seed.charCodeAt(i).toString(16);
        }
        id += "-" + (Math.random(seed) * 999999999).toFixed(0).toString(16);
        return id;
    }
};
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{}]},{},[1]);
