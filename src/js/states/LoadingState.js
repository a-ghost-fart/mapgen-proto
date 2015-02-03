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
