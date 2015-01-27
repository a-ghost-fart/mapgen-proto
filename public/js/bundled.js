(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

module.exports = {
    'preload': function () {
    
    },

    'create': function () {
        'use strict';
        this.initWorld();
        this.player = new Player(this, 30, 30);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.STYLE_TOPDOWN);
    },

    'initWorld': function () {
        'use strict';
        this.world = {};
        this.world.map = this.game.add.tilemap('test_map');
        this.world.map.addTilesetImage('test_tileset', 'test_tileset');
        this.world.layer = this.world.map.createLayer('collision');
        this.world.map.setCollision(1, true, this.world.layer);
        this.world.layer.resizeWorld();
    },

    'update': function () {
        'use strict';
        this.game.physics.arcade.collide(this.player, this.world.layer);
        this.player.handleUpdate(this);
    },

    'render': function () {
    
    }
};

},{"../characters/Player":1}]},{},[3])