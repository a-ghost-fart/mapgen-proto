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

        var testRoom = RoomFactory.generate();
        var testMap = MapFactory.generate();

        var _this = this;
        this.world = {};
        this.world.map = this.game.add.tilemap();
        this.world.map.addTilesetImage('test_tileset');
        this.world.layer = this.world.map.create('test', testMap[0].length * testRoom[0].length, testMap.length * testRoom[0].length, Config.TILE_SIZE, Config.TILE_SIZE);
        this.world.layer.resizeWorld();
        this.world.map.setCollision(1, true, this.world.layer);

        for (var y = 0; y < testMap.length; y++) {
            for (var x = 0; x < testMap[0].length; x++) {
                if (testMap[y][x] === 1) {
                    populateRooms(x * testRoom[0].length, y * testRoom[0].length);
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
            for (var y = 0; y < testRoom.length; y++) {
                for (var x = 0; x < testRoom[0].length; x++) {
                    if (testRoom[y][x] === 1) {
                        _this.world.map.putTile(1, offsetX + x, offsetY + y, 'test');
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
