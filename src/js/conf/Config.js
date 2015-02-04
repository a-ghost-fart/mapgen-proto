var tileSize = 32;

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
    'WIDTH': 864,
    /**
     * @attribute {Number} HEIGHT - Height of the canvas
     */
    'HEIGHT': 486,
    /**
     * @attribute {String} TITLE - Window title
     */
    'TITLE': 'Something',
    /**
     * @attribute {String} VERSION - Application version
     */
    'VERSION': '0.0.0',
    /**
     * @attribute {Number} ROOM_SIZE - Size of a room
     */
    'ROOM_WIDTH': tileSize * 40,
    /**
     * @attribute {Number} ROOM_HEIGHT - Size of a room
     */
    'ROOM_HEIGHT': tileSize * 20,
    /**
     * @attribute {Number} TILE_SIZE - Size of a single tile
     */
    'TILE_SIZE': tileSize
};
