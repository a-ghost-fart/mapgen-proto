var Player = require('../characters/Player');

var testMap = [
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0]
];

var testRoom = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
];



module.exports = {

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

    'initWorld': function () {
        'use strict';

        var _this = this;
        this.world = {};
        this.world.map = this.game.add.tilemap();
        this.world.map.addTilesetImage('test_tileset');
        this.world.layer = this.world.map.create('test', testMap[0].length * testRoom[0].length, testMap.length * testRoom[0].length, 32, 32);
        this.world.layer.resizeWorld();
        this.world.map.setCollision(1, true, this.world.layer);

        for (var y = 0; y < testMap.length; y++) {
            for (var x = 0; x < testMap[0].length; x++) {
                if (testMap[y][x] === 1) {
                    populateRooms(x * testRoom[0].length, y * testRoom[0].length);
                }
            }
        }

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

    'update': function () {
        'use strict';
        var _this = this;
        this.game.physics.arcade.collide(this.player, this.world.layer);
        this.game.physics.arcade.collide(this.player, this.dust_emitter);
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
