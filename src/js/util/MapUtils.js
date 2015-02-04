var RoomFactory = require('../factories/RoomFactory');
var Config = require('../conf/Config');

/**
 * Set of utility functions for map generation
 *
 * @module MapUtils
 */
module.exports = {

    'roomFactory': new RoomFactory(),


    /**
     * Add a background to the given room
     *
     * @param {Number} offsetX
     * @param {Number} offsetY
     * @param {Phaser.State} state
     */
    'addBackground': function addBackground(offsetX, offsetY, state) {
        'use strict';
        var bg = state.game.add.tileSprite(offsetX * Config.TILE_SIZE, offsetY * Config.TILE_SIZE, 1280, 640, 'test_background');
    },


    /**
     * carveEntrances
     *
     * @inner
     * @param {Number} x
     * @param {Number} y
     * @param {Number} offsetX
     * @param {Number} offsetY
     * @param {Phaser.State} state
     * @param {Array} map
     */
    'carveEntrances': function carveEntrances(x, y, offsetX, offsetY, state, map) {
        'use strict';

        var mapTop = (y - 1 >= 0)
            ? map[y - 1][x]
            : undefined;
        var mapLeft = (x - 1 >= 0)
            ? map[y][x - 1]
            : undefined;

        if (mapTop !== undefined) {
            var width = Math.floor(Math.random() * (6 - 3) + 3);
            var start = Math.floor(Math.random() * (39 - 1) + 1);
            for (var i = 0; i < width; i++) {
                state.world.map.removeTile(offsetX + start + i, offsetY, 'test');
                state.world.map.removeTile(offsetX + start + i, offsetY - 1, 'test');
            }
        }

        if (mapLeft !== undefined) {
            var pos = (Math.random() > 0.5) ? 1 : 16;
            for (var ii = 0; ii < 3; ii++) {
                state.world.map.removeTile(offsetX, offsetY + pos + ii, 'test');
                state.world.map.removeTile(offsetX - 1, offsetY + pos + ii, 'test');
            }
        }
    },


    /**
     * Finds the furthest room from the spawn location,
     * well, ok, it finds one of the rooms at the furthest
     * point.
     *
     * @inner
     * @return {Phaser.Point}
     */
    'findFurthestRoom': function findFurthestRoom(state, map) {
        'use strict';
        var max = 0;
        var furthest = null;
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (map[y][x] !== undefined && (x !== state.game.spawnRoom.x && y !== state.game.spawnRoom.y)) {
                    var dist = Math.abs(x - state.game.spawnRoom.x) + Math.abs(y - state.game.spawnRoom.y);
                    if (dist > max) {
                        max = dist;
                        furthest = new Phaser.Point(x, y);
                    }
                }
            }
        }
        return furthest;
    },


    /**
     * Populates the room in the empty map based on a
     * pre-generated room layout from Tiled.
     *
     * @inner
     * @param {Number} offsetX - Current room offset x
     * @param {Number} offsetY - Current room offset y
     */
    'populateRooms': function populateRooms(offsetX, offsetY, state) {
        'use strict';
        var room = this.roomFactory.selectRandom();
        for (var y = 0; y < Config.ROOM_TILE_HEIGHT; y++) {
            for (var x = 0; x < Config.ROOM_TILE_WIDTH; x++) {
                if (room[y][x] !== 0) {
                    state.world.map.putTile(room[y][x], offsetX + x, offsetY + y, 'test');
                } else {
                    state.world.map.removeTile(offsetX + x, offsetY + y, 'test');
                }
            }
        }
    },


    /**
     * Checks neighbours of the current cell and sees if a boundary
     * wall should be drawn, to stop the player leaving the map.
     *
     * @inner
     * @param {Number} x - Current room x coordinate
     * @param {Number} y - Current room y coordinate
     * @param {Number} offsetX - Pixel offset for room
     * @param {Number} offsetY - Pixel offset for room
     */
    'addBoundaries': function addBoundaries(map, x, y, offsetX, offsetY, game) {
        'use strict';
        // Check top
        if (
            y - 1 < 0 ||
            map[y - 1][x] === undefined
        ) {
            for (var i = 0; i < Config.ROOM_TILE_WIDTH; i++) {
                game.world.map.putTile(1, offsetX + i, offsetY, 'test');
            }
        }

        // check bottom
        var mapBot = (y + 1 < map.length)
            ? map[y + 1][x]
            : undefined;
        if (
            y + 1 > Config.ROOM_TILE_HEIGHT ||
            y + 1 > map.length ||
            mapBot === undefined
        ) {
            for (var ii = 0; ii < Config.ROOM_TILE_WIDTH; ii++) {
                game.world.map.putTile(1, offsetX + ii, offsetY + Config.ROOM_TILE_HEIGHT - 1);
            }
        }

        // check left
        if (
            x - 1 < 0 ||
            map[y][x - 1] === undefined
        ) {
            for (var iii = 0; iii < Config.ROOM_TILE_HEIGHT; iii++) {
                game.world.map.putTile(1, offsetX, offsetY + iii);
            }
        }

        // check right
        var mapRight = (x + 1 < map[y].length)
            ? map[y][x + 1]
            : undefined;
        if (
            x + 1 > Config.ROOM_TILE_WIDTH ||
            x + 1 > map[0].length ||
            mapRight === undefined
        ) {
            for (var iv = 0; iv < Config.ROOM_TILE_HEIGHT; iv++) {
                game.world.map.putTile(1, offsetX + Config.ROOM_TILE_WIDTH - 1, offsetY + iv);
            }
        }
    }
};
