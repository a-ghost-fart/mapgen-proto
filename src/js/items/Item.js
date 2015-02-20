/**
 * Item
 *
 * @constructor
 * @param {Phaser.Game} game - the current game
 * @param {Number} x - spawn x coordinate
 * @param {Number} y - spawn y coordinate
 * @param {String} _name - item name
 * @param {String} _description - item description
 */
export class Item extends Phaser.Sprite {
    constructor(game, x, y, name, description) {
        super(game, x, y, 'test_sprite_small');
        this.name = name;
        this.description = description;

        this.enablePhysics(game);
    }


    /**
     * enablePhysics
     *
     * @method
     * @param {Phaser.Game}
     */
    enablePhysics(game) {
        game.physics.arcade.enable(this);
        this.body.bounce.y = 0.5;
        this.body.gravity.y = 300;
        this.anchor.setTo(0.5, 0.5);
    }
}
