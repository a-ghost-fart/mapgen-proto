(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

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
function Player(game, _x, _y) {
    'use strict';
    Phaser.Sprite.call(this, game, _x, _y, 'test_sprite');

    this.jumpSpeed = 350;
    this.movementSpeed = 250;
    this.fire_cooldown = 0;
    this.fireRate = 400;
    this.projectiles = game.add.group();
    this.projectileSpeed = 400;
    this.baseGravity = 450;
    this.hasWalljumped = false;

    this.enablePhysics(game);
    this.initProjectiles();
}


/**
 * Sets up the physics and spawns 50 spare projectiles
 * that can be killed, cached, and used for firing as
 * opposed to creating each one on the fly.
 *
 * @method
 */
Player.prototype.initProjectiles = function () {
    'use strict';
    this.projectiles.enableBody = true;
    this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    this.projectiles.createMultiple(50, 'test_sprite_small');
    this.projectiles.setAll('checkWorldBounds', true);
    this.projectiles.setAll('outOfBoundsKill', true);
};


/**
 * Sets up the player sprite to use
 * arcade physics and configures gravity,
 * bounce, and the like.
 *
 * @method
 * @param {Phaser.Game} game - The current game
 */
Player.prototype.enablePhysics = function (game) {
    'use strict';
        game.physics.arcade.enable(this);
        this.body.bounce.y = 0;
        this.body.allowGravity = true;
        this.body.gravity.y = this.baseGravity;
        this.anchor.setTo(0.5, 0);
        this.body.collideWorldBounds = true;
};


/**
 * Fires a projectile at the mouse pointer
 *
 * @method
 * @param {Phaser.Game} game - The current game
 */
Player.prototype.fire = function (game) {
    'use strict';
    if (game.time.now > this.fire_cooldown && this.projectiles.countDead() > 0) {
        this.fire_cooldown = game.time.now + this.fireRate;
        var projectile = this.projectiles.getFirstDead();
        projectile.reset(this.x, this.y);
        projectile.rotation = game.physics.arcade.angleToPointer(projectile);
        game.physics.arcade.moveToPointer(projectile, this.projectileSpeed);
    }
};


/**
 * Player's update method as update() is taken by
 * the parent class, Phaser.Sprite.
 *
 * @method
 * @param {Phaser.Game} game - The current game
 */
Player.prototype.handleUpdate = function (game) {
    'use strict';
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
};


module.exports = Player;

},{}],2:[function(require,module,exports){
var tileSize = 32;

/**
 * Configuration object, used for constants
 * across the application
 *
 * @module Config
 */
module.exports = {
    /**
     * @attribute {Number} WIDTH - Width of the canvas
     */
    'WIDTH': 864,
    /**
     * @attribute {Number} HEIGHT - Height of the canvas
     */
    'HEIGHT': 486,
    /**
     * @attribute {String} TITLE - Window title
     */
    'TITLE': 'Something',
    /**
     * @attribute {String} VERSION - Application version
     */
    'VERSION': '0.0.0',
    /**
     * @attribute {Number} ROOM_SIZE - Size of a room
     */
    'ROOM_WIDTH': tileSize * 40,
    /**
     * @attribute {Number} ROOM_HEIGHT - Size of a room
     */
    'ROOM_HEIGHT': tileSize * 20,
    /**
     * @attribute {Number} TILE_SIZE - Size of a single tile
     */
    'TILE_SIZE': tileSize
};

},{}],3:[function(require,module,exports){

/**
 * Assigning indexes to cardinal directions
 *
 * @enum
 * @readonly
 */
var Direction = {
    'NORTH': 0,
    'SOUTH': 1,
    'EAST': 2,
    'WEST': 3
};

/**
 * Utility class with helper methods for
 * generating maps
 *
 * @constructor
 */
function MapFactory(game) {
    'use strict';
    this.map = [];
}

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
MapFactory.prototype.generate = function (game, _difficulty) {
    'use strict';
    var difficulty = _difficulty;
    var steps = difficulty * 5;

    // Initialise the arrays to the correct size
    for (var y = 0; y < difficulty; y++) {
        this.map[y] = [];
        for (var x = 0; x < difficulty; x++) {
            this.map[y][x] = undefined;
        }
    }

    var position = new Phaser.Point(
        Math.floor(Math.random() * this.map[0].length),
        Math.floor(Math.random() * this.map.length)
    );

    game.spawnRoom = position;

    for (var i = 0; i < steps; i++) {
        switch(Math.floor(Math.random() * 4)) {
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
};


/**
 * Helper function to quickly check if the selected
 * coordinate is within the bounds of the map
 *
 * @param {Number} x
 * @param {Number} y
 * @return {Boolean}
 */
MapFactory.prototype.checkInBounds = function (x, y) {
    'use strict';
    return x > 0 &&
           y > 0 &&
           x < this.map[0].length &&
           y < this.map.length;
};

module.exports = MapFactory;

},{}],4:[function(require,module,exports){
/**
 * Static class representing tools for
 * room generation;
 *
 * @constructor
 * @param {Phaser.Game} game - The current game
 */
function RoomFactory(game) {
    'use strict';
    this.rooms = [];
    this.dimensions = new Phaser.Point(40, 20);
    this.initRooms(game);
}


/**
 * Adds Tiled json files to the possible room pool
 *
 * @param {Phaser.Game} game - Current game
 */
RoomFactory.prototype.initRooms = function (game) {
    'use strict';
    this.rooms.push([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]);
};


/**
 * Generates a room layout for the current world represented
 * by a two dimensional array;
 *
 * @return {Array} Two dimensional array representing a map
 */
RoomFactory.prototype.selectRandom = function () {
    'use strict';
    var rand = Math.floor(Math.random() * this.rooms.length);
    return this.rooms[rand];
};


module.exports = RoomFactory;

},{}],5:[function(require,module,exports){
var Config = require('./conf/Config');

/**
 * Bootstrap the game. For the purpose of
 * debugging, the game itself is applied
 * to the window object, but eventually
 * this will fall off and just sit within
 * it's own scope.
 */
window.onload = function () {
    'use strict';
    document.title = Config.TITLE + ' v' + Config.VERSION;
    window.g = new Phaser.Game(
        Config.WIDTH,
        Config.HEIGHT,
        Phaser.AUTO
    );
    window.g.state.add('load', require('./states/LoadingState'));
    window.g.state.add('play', require('./states/PlayState'));
    window.g.state.start('load');
};

},{"./conf/Config":2,"./states/LoadingState":6,"./states/PlayState":7}],6:[function(require,module,exports){
/**
 * state to handle preloading of assets for use
 * throughout the rest of the game. at present
 * just handles everything upfront, but could
 * use moving to specific states.
 * 
 * @module LoadingState
 * @extends Phaser.State
 */
module.exports = {


    /**
     * Preload step for the loading state.
     *
     * @attribute {Function}
     */
    'preload': function () {
        'use strict';
        this.load.image('test_sprite', 'assets/sprites/test_sprite.png');
        this.load.image('test_sprite_small', 'assets/sprites/test_sprite_small.png');
        this.load.image('test_tileset', 'assets/tilesets/test_tileset.png');

        this.load.bitmapFont('bitmap_font', 'assets/ui/font.png', 'assets/ui/font.xml');
    },


    /**
     * Create state, called to create the preloadBar and stuff
     * like that.
     *
     * @attribute {Function}
     */
    'create': function () {
        'use strict';

        this.text = this.game.add.bitmapText(this.game.centerX, this.game.centerY, 'bitmap_font', 'Loading', 12);
        this.text.align = 'center';
        this.text.fixedToCamera = true;
    },


    /**
     * Update state, in this case used to update the progress bar,
     * then progress to the main play state if complete.
     *
     * @attribute {Function}
     */
    'update': function () {
        'use strict';
        this.text.destroy();
        if (this.game.load.progress === 100) {
            this.state.start('play');
        }
    }
};

},{}],7:[function(require,module,exports){
var Config = require('../conf/Config');
var Player = require('../characters/Player');
var MapFactory = require('../factories/MapFactory');
var RoomFactory = require('../factories/RoomFactory');

/**
 * Main game loop state
 * 
 * @module PlayState
 * @extends Phaser.State
 */
module.exports = {

    'preload': function () {
        'use strict';
        this.initWorld();
    },

    /**
     * Called when creating the play state after preloading
     * of assets is already handled.
     *
     * @attribute {Function}
     */
    'create': function () {
        'use strict';
        this.player = new Player(this, (this.game.spawnRoom.x * Config.ROOM_WIDTH) + 64, (this.game.spawnRoom.y * Config.ROOM_HEIGHT) + 64);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);

        // Ideally this needs to go somewhere, not sure where yet.
        this.dust_emitter = this.game.add.emitter(0, 0, 100);
        this.dust_emitter.makeParticles('test_sprite_small');
        this.dust_emitter.gravity = 200;
    },


    /**
     * Initialises the world, generates the map and populates
     * room tiles procedurally.
     *
     * @todo This takes forever, need to offload it to the preload
     * state or something.
     * @attribute {Function}
     */
    'initWorld': function () {
        'use strict';
        var _this = this;

        var roomFactory = new RoomFactory(this.game);
        var mapFactory = new MapFactory(this.game);

        var map = mapFactory.generate(this.game, 5);

        this.world = {};
        this.world.map = this.game.add.tilemap();
        this.world.map.addTilesetImage('test_tileset');
        this.world.layer = this.world.map.create('test', map[0].length * roomFactory.dimensions.x, map.length * roomFactory.dimensions.y, Config.TILE_SIZE, Config.TILE_SIZE);
        this.world.layer.resizeWorld();
        this.world.map.setCollision(1, true, this.world.layer);
        this.world.map.fill(1, 0, 0, map[0].length * roomFactory.dimensions.x, map.length * roomFactory.dimensions.y, 'test');
        this.world.furthest = findFurthestRoom();

        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1) {
                    populateRooms(x * roomFactory.dimensions.x, y * roomFactory.dimensions.y);
                    addBoundaries(x, y, x * roomFactory.dimensions.x, y * roomFactory.dimensions.y);
                }
            }
        }


        /**
         * Finds the furthest room from the spawn location,
         * well, ok, it finds one of the rooms at the furthest
         * point.
         *
         * @inner
         * @return {Phaser.Point}
         */
        function findFurthestRoom() {
            var max = 0;
            var furthest = null;
            for (var y = 0; y < map.length; y++) {
                for (var x = 0; x < map[0].length; x++) {
                    if (map[y][x] !== undefined && (x !== _this.game.spawnRoom.x && y !== _this.game.spawnRoom.y)) {
                        var dist = Math.abs(x - _this.game.spawnRoom.x) + Math.abs(y - _this.game.spawnRoom.y);
                        if (dist > max) {
                            max = dist;
                            furthest = new Phaser.Point(x, y);
                        }
                    }
                }
            }
            return furthest;
        }

        /**
         * Populates the room in the empty map based on a
         * pre-generated room layout from Tiled.
         *
         * @inner
         * @param {Number} offsetX - Current room offset x
         * @param {Number} offsetY - Current room offset y
         */
        function populateRooms(offsetX, offsetY) {
            var room = roomFactory.selectRandom();
            for (var y = 0; y < roomFactory.dimensions.y; y++) {
                for (var x = 0; x < roomFactory.dimensions.x; x++) {
                    if (room[y][x] !== 0) {
                        _this.world.map.putTile(room[y][x], offsetX + x, offsetY + y, 'test');
                    } else {
                        _this.world.map.removeTile(offsetX + x, offsetY + y, 'test');
                    }
                }
            }
        }

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
        function addBoundaries(x, y, offsetX, offsetY) {
            // Check top
            if (
                y - 1 < 0 ||
                map[y - 1][x] === undefined
            ) {
                for (var i = 0; i < roomFactory.dimensions.x; i++) {
                    _this.world.map.putTile(1, offsetX + i, offsetY, 'test');
                }
            }

            // check bottom
            var mapBot = (y + 1 < map.length)
                ? map[y + 1][x]
                : undefined;
            if (
                y + 1 > roomFactory.dimensions.y ||
                y + 1 > map.length ||
                mapBot === undefined
            ) {
                for (var ii = 0; ii < roomFactory.dimensions.x; ii++) {
                    _this.world.map.putTile(1, offsetX + ii, offsetY + roomFactory.dimensions.y - 1);
                }
            }

            // check left
            if (
                x - 1 < 0 ||
                map[y][x - 1] === undefined
            ) {
                for (var iii = 0; iii < roomFactory.dimensions.y; iii++) {
                    _this.world.map.putTile(1, offsetX, offsetY + iii);
                }
            }

            // check right
            var mapRight = (x + 1 < map[y].length)
                ? map[y][x + 1]
                : undefined;
            if (
                x + 1 > roomFactory.dimensions.x ||
                x + 1 > map[0].length ||
                mapRight === undefined
            ) {
                for (var iv = 0; iv < roomFactory.dimensions.y; iv++) {
                    _this.world.map.putTile(1, offsetX + roomFactory.dimensions.x - 1, offsetY + iv);
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
    'update': function () {
        'use strict';
        var _this = this;

        this.game.physics.arcade.collide(this.player, this.world.layer);
        this.player.handleUpdate(this);
        this.game.physics.arcade.collide(this.dust_emitter, this.world.layer);
        this.game.physics.arcade.collide(this.player.projectiles, this.world.layer, function (projectile) {
            _this.dust_emitter.x = projectile.x;
            _this.dust_emitter.y = projectile.y;
            _this.dust_emitter.start(true, 2000, null, 10);
            projectile.kill();
        });
    },

};

},{"../characters/Player":1,"../conf/Config":2,"../factories/MapFactory":3,"../factories/RoomFactory":4}]},{},[5])