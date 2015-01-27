var Player = require('../characters/Player');

module.exports = {
    'preload': function () {
    
    },

    'create': function () {
        'use strict';
        this.initWorld();
        this.player = new Player(this, 30, 30);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);
    },

    'initWorld': function () {
        'use strict';
        this.world = {};
        this.world.map = this.game.add.tilemap('test_map');
        this.world.map.addTilesetImage('test_tileset', 'test_tileset');
        this.world.layer = this.world.map.createLayer('collision');
        this.world.map.setCollision(1, true, this.world.layer);
        this.world.layer.resizeWorld();
    },

    'update': function () {
        'use strict';
        this.game.physics.arcade.collide(this.player, this.world.layer);
        this.player.handleUpdate(this);
    },

    'render': function () {
    
    }
};
