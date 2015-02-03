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
    this.fire_rate = 400;
    this.projectiles = game.add.group();

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
        this.body.gravity.y = 450;
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
        this.fire_cooldown = game.time.now + this.fire_rate;
        var projectile = this.projectiles.getFirstDead();
        projectile.reset(this.x, this.y);
        projectile.rotation = game.physics.arcade.angleToPointer(projectile);
        game.physics.arcade.moveToPointer(projectile, 300);
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
    'WIDTH': 800,
    /**
     * @attribute {Number} HEIGHT - Height of the canvas
     */
    'HEIGHT': 600,
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
    'ROOM_SIZE': 16 * 20,
    /**
     * @attribute {Number} TILE_SIZE - Size of a single tile
     */
    'TILE_SIZE': 16
};

},{}],3:[function(require,module,exports){
var testMap = [
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0]
];

/**
 * Utility class with helper methods for
 * generating maps
 *
 * @constructor
 */
function MapFactory(game) {}


/**
 * Generates a map layout for the current world represented
 * by a two dimensional array;
 *
 * @todo At present just outputs the testMap variable because this is still a WIP
 *
 * @static
 * @return {Array} Two dimensional array representing a map
 */
MapFactory.prototype.generate = function () {
    'use strict';
    return testMap;
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
    this.dimensions = new Phaser.Point(20, 20);
    this.initRooms(game);
}


/**
 * Adds Tiled json files to the possible room pool
 *
 * @param {Phaser.Game} game - Current game
 */
RoomFactory.prototype.initRooms = function (game) {
    'use strict';
    this.rooms.push(game.add.tilemap('test_room_1'));
    this.rooms.push(game.add.tilemap('test_room_2'));
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
    return this.rooms[rand].layers[0].data;
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

        this.load.tilemap('test_room_1', 'assets/maps/test_room_1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('test_room_2', 'assets/maps/test_room_2.json', null, Phaser.Tilemap.TILED_JSON);
    },


    /**
     * Create state, called once the preload phase
     * has finished, just moves the application onto
     * the next state, for now, the play state.
     *
     * @attribute {Function}
     */
    'create': function () {
        'use strict';
        this.state.start('play');
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

    /**
     * Called when creating the play state after preloading
     * of assets is already handled.
     *
     * @attribute {Function}
     */
    'create': function () {
        'use strict';
        this.initWorld();
        this.player = new Player(this, 30, 30);
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
     * @attribute {Function}
     */
    'initWorld': function () {
        'use strict';

        var roomFactory = new RoomFactory(this.game);
        var mapFactory = new MapFactory(this.game);

        var map = mapFactory.generate();

        var _this = this;
        this.world = {};
        this.world.map = this.game.add.tilemap();
        this.world.map.addTilesetImage('test_tileset');
        this.world.layer = this.world.map.create('test', map[0].length * roomFactory.dimensions.x, map.length * roomFactory.dimensions.y, Config.TILE_SIZE, Config.TILE_SIZE);
        this.world.layer.resizeWorld();
        this.world.map.setCollision(1, true, this.world.layer);

        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (map[y][x] === 1) {
                    populateRooms(x * roomFactory.dimensions.x, y * roomFactory.dimensions.y);
                }
            }
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
                    if (room[y][x].index !== -1) {
                        _this.world.map.putTile(room[y][x].index, offsetX + x, offsetY + y, 'test');
                    }
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