Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, _x, _y) {
    'use strict';
    Phaser.Sprite.call(this, game, _x, _y, 'test_sprite');

    this.jumpSpeed = 350;
    this.movementSpeed = 250;

    this.enablePhysics(game);

    this.projectiles = game.add.group();
    this.projectiles.enableBody = true;
    this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    this.projectiles.createMultiple(50, 'test_sprite_small');
    this.projectiles.setAll('checkWorldBounds', true);
    this.projectiles.setAll('outOfBoundsKill', true);
    this.fire_cooldown = 0;
    this.fire_rate = 100;
}

Player.prototype.enablePhysics = function (game) {
    'use strict';
        game.physics.arcade.enable(this);
        this.body.bounce.y = 0;
        this.body.gravity.y = 450;
        this.anchor.setTo(0.5, 0);
        this.body.collideWorldBounds = true;
};

Player.prototype.fire = function (game, target) {
    'use strict';
    if (game.time.now > this.fire_cooldown && this.projectiles.countDead() > 0) {
        this.fire_cooldown = game.time.now + this.fire_rate;
        var projectile = this.projectiles.getFirstDead();
        projectile.reset(this.x, this.y);
        projectile.rotation = game.physics.arcade.angleToPointer(projectile);
        game.physics.arcade.moveToPointer(projectile, 300);
    }
};

Player.prototype.handleUpdate = function (game) {
    'use strict';
    this.body.velocity.x = 0;

    if (game.input.activePointer.isDown) {
        this.fire(game, game.input.mousePointer.position);
    }

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
