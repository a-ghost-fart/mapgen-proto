/**
 * Static class representing tools for
 * room generation;
 *
 * @constructor
 * @param {Phaser.Game} game - The current game
 */
function RoomFactory(game) {
    'use strict';
    this.rooms = [];
    this.dimensions = new Phaser.Point(40, 20);
    this.initRooms(game);
}


/**
 * Adds Tiled json files to the possible room pool
 *
 * @param {Phaser.Game} game - Current game
 */
RoomFactory.prototype.initRooms = function (game) {
    'use strict';
    this.rooms.push(game.add.tilemap('test_room_1'));
    this.rooms.push(game.add.tilemap('test_room_2'));
};


/**
 * Generates a room layout for the current world represented
 * by a two dimensional array;
 *
 * @return {Array} Two dimensional array representing a map
 */
RoomFactory.prototype.selectRandom = function () {
    'use strict';
    var rand = Math.floor(Math.random() * this.rooms.length);
    return this.rooms[rand].layers[0].data;
};


module.exports = RoomFactory;
