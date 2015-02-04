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
