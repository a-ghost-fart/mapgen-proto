var Config = require('../conf/Config');
var Player = require('../characters/Player');
var MapFactory = require('../factories/MapFactory');
var MapUtils = require('../util/MapUtils');

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
        this.dust_emitter.bounce.y = 0.4;
        this.dust_emitter.alpha = 0.3;
        this.dust_emitter.gravity = 250;
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
    'initWorld': function () {
        'use strict';
        var _this = this;

        var mapFactory = new MapFactory(this.game);

        var map = mapFactory.generate(this.game, 5);

        this.world = {};
        this.world.map = this.game.add.tilemap();
        this.world.map.addTilesetImage('test_tileset');
        this.world.layer = this.world.map.create('test', map[0].length * Config.ROOM_TILE_WIDTH, map.length * Config.ROOM_TILE_HEIGHT, Config.TILE_SIZE, Config.TILE_SIZE);
        this.world.layer.resizeWorld();
        this.world.map.setCollision(1, true, this.world.layer);
        this.world.map.fill(1, 0, 0, map[0].length * Config.ROOM_TILE_WIDTH, map.length * Config.ROOM_TILE_HEIGHT, 'test');
        this.world.furthest = MapUtils.findFurthestRoom(this, map);

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
