Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

function Projectile(game, _x, _y) {
    'use strict';
    Phaser.Sprite.call(this, game, _x, _y, 'test_sprite_small');
}

module.exports = Projectile;
