Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

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
function Item(game, x, y, _name, _description) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'test_sprite_small');
    this.name = _name;
    this.description = _description;

    this.enablePhysics(game);
}


/**
 * enablePhysics
 *
 * @method
 * @param {Phaser.Game}
 */
Item.prototype.enablePhysics = function (game) {
    'use strict';
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0.5;
    this.body.gravity.y = 300;
    this.anchor.setTo(0.5, 0.5);
};

module.exports = Item;
