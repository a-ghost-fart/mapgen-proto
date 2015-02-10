var Inventory = require('../items/Inventory');
var Journal = require('../quest/Journal');

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/**
 * Represents the player. Whilst not a singleton,
 * should be treated as such anyway because of reasons.
 *
 * @constructor
 * @extends {Phaser.Sprite}
 * @param {Phaser.Game} game - The current game
 * @param {float} _x - The x coordinate to spawn player
 * @param {float} _y - The y coordinate to spawn player
 */
function Player(game, _x, _y) {
    'use strict';
    Phaser.Sprite.call(this, game, _x, _y, 'test_sprite');

    this.jumpSpeed = 350;
    this.movementSpeed = 250;
    this.fire_cooldown = 0;
    this.fireRate = 400;
    this.projectiles = game.add.group();
    this.projectileSpeed = 400;
    this.baseGravity = 450;
    this.hasWalljumped = false;
    this.inventory = new Inventory(12);
    this.journal = new Journal();

    this.enablePhysics(game);
    this.initProjectiles();
}


/**
 * Sets up the physics and spawns 50 spare projectiles
 * that can be killed, cached, and used for firing as
 * opposed to creating each one on the fly.
 *
 * @method
 */
Player.prototype.initProjectiles = function () {
    'use strict';
    this.projectiles.enableBody = true;
    this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    this.projectiles.createMultiple(50, 'test_sprite_small');
    this.projectiles.setAll('checkWorldBounds', true);
    this.projectiles.setAll('outOfBoundsKill', true);
};


/**
 * Sets up the player sprite to use
 * arcade physics and configures gravity,
 * bounce, and the like.
 *
 * @method
 * @param {Phaser.Game} game - The current game
 */
Player.prototype.enablePhysics = function (game) {
    'use strict';
        game.physics.arcade.enable(this);
        this.body.bounce.y = 0;
        this.body.allowGravity = true;
        this.body.gravity.y = this.baseGravity;
        this.anchor.setTo(0.5, 0);
        this.body.collideWorldBounds = true;
};


/**
 * Fires a projectile at the mouse pointer
 *
 * @method
 * @param {Phaser.Game} game - The current game
 */
Player.prototype.fire = function (game) {
    'use strict';
    if (game.time.now > this.fire_cooldown && this.projectiles.countDead() > 0) {
        this.fire_cooldown = game.time.now + this.fireRate;
        var projectile = this.projectiles.getFirstDead();
        projectile.reset(this.x, this.y);
        projectile.rotation = game.physics.arcade.angleToPointer(projectile);
        game.physics.arcade.moveToPointer(projectile, this.projectileSpeed);
    }
};


/**
 * Called on collision with a consumable,
 * adds the item to the inventory in the first
 * available slot
 *
 * @method
 * @param {Item} item
 */
Player.prototype.pickUp = function (item) {
    'use strict';
    this.inventory.add(item);
};


/**
 * Player's update method as update() is taken by
 * the parent class, Phaser.Sprite.
 *
 * @method
 * @param {Phaser.Game} game - The current game
 */
Player.prototype.handleUpdate = function (game) {
    'use strict';
    this.body.velocity.x = 0;

    if (game.input.activePointer.isDown) {
        this.fire(game);
    }

    if (this.body.blocked.left || this.body.blocked.right) {
        this.body.gravity.y = 50;
    } else {
        this.body.gravity.y = this.baseGravity;
        this.hasWalljumped = false;
    }

    if (this.body.blocked.left && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.hasWalljumped) {
        this.body.velocity.y = -this.jumpSpeed;
        this.body.velocity.x = this.movementSpeed;
        this.hasWalljumped = true;
    }

    if (this.body.blocked.right && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.hasWalljumped) {
        this.body.velocity.y = -this.jumpSpeed;
        this.body.velocity.x = -this.movementSpeed;
        this.hasWalljumped = true;
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
