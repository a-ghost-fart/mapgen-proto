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
