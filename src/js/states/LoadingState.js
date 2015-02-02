module.exports = {
    'preload': function () {
        'use strict';
        this.load.image('test_sprite', 'assets/sprites/test_sprite.png');
        this.load.image('test_sprite_small', 'assets/sprites/test_sprite_small.png');
        this.load.image('test_tileset', 'assets/tilesets/test_tileset.png');
        this.load.tilemap('test_map', 'assets/maps/test_room_1.json', null, Phaser.Tilemap.TILED_JSON);
    },
    'create': function () {
        'use strict';
        this.state.start('play');
    }
};
