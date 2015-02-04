var pkg = require('./../../../package.json');
var tileSize = 32;
var roomWidth = 40;
var roomHeight = 20;

/**
 * Configuration object, used for constants
 * across the application
 *
 * @module Config
 */
module.exports = {
    /**
     * @attribute {Number} WIDTH - Width of the canvas
     */
    'WIDTH': 960,
    /**
     * @attribute {Number} HEIGHT - Height of the canvas
     */
    'HEIGHT': 540,
    /**
     * @attribute {String} TITLE - Window title
     */
    'TITLE': pkg.name,
    /**
     * @attribute {String} VERSION - Application version
     */
    'VERSION': pkg.version,
    /**
     * @attribute {Number} ROOM_TILE_WIDTH - Rooms are how many tiles wide?
     */
    'ROOM_TILE_WIDTH': roomWidth,
    /**
     * @attribute {Number} ROOM_TILE_HEIGHT - Rooms are how many tiles high?
     */
    'ROOM_TILE_HEIGHT': roomHeight,
    /**
     * @attribute {Number} ROOM_SIZE - Size of a room
     */
    'ROOM_WIDTH': tileSize * roomWidth,
    /**
     * @attribute {Number} ROOM_HEIGHT - Size of a room
     */
    'ROOM_HEIGHT': tileSize * roomHeight,
    /**
     * @attribute {Number} TILE_SIZE - Size of a single tile
     */
    'TILE_SIZE': tileSize
};
