(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
module.exports = {
    'WIDTH': 800,
    'HEIGHT': 600,
    'TITLE': 'Something',
    'VERSION': '0.0.0',
    'ROOM_SIZE': 16 * 20,
    'TILE_SIZE': 16
};

},{}],3:[function(require,module,exports){
var Config = require('./conf/Config');

window.onload = function () {
    'use strict';
    document.title = Config.TITLE + ' v' + Config.VERSION;
    window.g = new Phaser.Game(
        Config.WIDTH,
        Config.HEIGHT,
        Phaser.AUTO
    );
    window.g.state.add('load', require('./states/LoadingState'));
    window.g.state.add('play', require('./states/PlayState'));
    window.g.state.start('load');
};

},{"./conf/Config":2,"./states/LoadingState":4,"./states/PlayState":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var Player = require('../characters/Player');

var testMap = [
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0]
];

var testRoom = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
];



module.exports = {

    'create': function () {
        'use strict';
        this.initWorld();
        this.player = new Player(this, 30, 30);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);

        this.dust_emitter = this.game.add.emitter(0, 0, 100);
        this.dust_emitter.makeParticles('test_sprite_small');
        this.dust_emitter.gravity = 200;
    },

    'initWorld': function () {
        'use strict';

        var _this = this;
        this.world = {};
        this.world.map = this.game.add.tilemap();
        this.world.map.addTilesetImage('test_tileset');
        this.world.layer = this.world.map.create('test', testMap[0].length * testRoom[0].length, testMap.length * testRoom[0].length, 32, 32);
        this.world.layer.resizeWorld();
        this.world.map.setCollision(1, true, this.world.layer);

        for (var y = 0; y < testMap.length; y++) {
            for (var x = 0; x < testMap[0].length; x++) {
                if (testMap[y][x] === 1) {
                    populateRooms(x * testRoom[0].length, y * testRoom[0].length);
                }
            }
        }

        function populateRooms(offsetX, offsetY) {
            for (var y = 0; y < testRoom.length; y++) {
                for (var x = 0; x < testRoom[0].length; x++) {
                    if (testRoom[y][x] === 1) {
                        _this.world.map.putTile(1, offsetX + x, offsetY + y, 'test');
                    }
                }
            }
        }
    },

    'update': function () {
        'use strict';
        var _this = this;
        this.game.physics.arcade.collide(this.player, this.world.layer);
        this.game.physics.arcade.collide(this.player, this.dust_emitter);
        this.player.handleUpdate(this);
        this.game.physics.arcade.collide(this.dust_emitter, this.world.layer);
        this.game.physics.arcade.collide(this.player.projectiles, this.world.layer, function (projectile) {
            _this.dust_emitter.x = projectile.x;
            _this.dust_emitter.y = projectile.y;
            _this.dust_emitter.start(true, 2000, null, 10);
            projectile.kill();
        });
    },

};

},{"../characters/Player":1}]},{},[3])