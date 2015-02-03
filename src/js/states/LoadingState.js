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
     * Create state, called to create the preloadBar and stuff
     * like that.
     *
     * @attribute {Function}
     */
    'create': function () {
        'use strict';

        this.preloadBar = this.game.add.graphics(0, 50);
        this.preloadBar.lineStyle(3, 0xffffff, 1);
        this.preloadBar.moveTo(0, 0);
        this.preloadBar.lineTo(this.game.width, 0);
        this.preloadBar.scale.x = 0; // set the bar to the beginning position
    },


    /**
     * Update state, in this case used to update the progress bar,
     * then progress to the main play state if complete.
     *
     * @attribute {Function}
     */
    'update': function () {
        'use strict';
        this.preloadBar.scale.x = this.game.load.progress * 0.01;
        if (this.game.load.progress === 100) {
            this.state.start('play');
        }
    }
};
