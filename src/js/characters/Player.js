Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, _x, _y) {
    'use strict';
    Phaser.Sprite.call(this, game, _x, _y, 'test_tileset');

    this.jumpSpeed = 350;
    this.movementSpeed = 250;

    this.enablePhysics(game);
}

Player.prototype.enablePhysics = function (game) {
    'use strict';
        game.physics.arcade.enable(this);
        this.body.bounce.y = 0;
        this.body.gravity.y = 450;
        this.anchor.setTo(0.5, 0);
        this.body.collideWorldBounds = true;
};

Player.prototype.handleUpdate = function (game) {
    'use strict';
    this.body.velocity.x = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.body.velocity.x = -this.movementSpeed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.body.velocity.x = this.movementSpeed;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.body.onFloor()) {
        this.body.velocity.y = -this.jumpSpeed;
    }
};

module.exports = Player;
