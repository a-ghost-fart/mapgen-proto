
/**
 * Assigning indexes to cardinal directions
 *
 * @enum
 * @readonly
 */
var Direction = {
    'NORTH': 0,
    'SOUTH': 1,
    'EAST': 2,
    'WEST': 3
};

/**
 * Utility class with helper methods for
 * generating maps
 *
 * @constructor
 */
export class MapFactory {
    constructor(game) {
        this.map = [];
    }


    /**
     * Generates a map layout based on an arbitrary difficulty
     * parameter. This parameter affects the size of the level
     * and also the number of steps taken, though it is still
     * pretty random.
     *
     * @param {Phaser.Game} game - The current game
     * @param {Number} _difficulty - Difficulty value
     * @return {Array} Two dimensional array representing a map
     */
    generate(game, _difficulty) {
        var difficulty = _difficulty;
        var steps = difficulty * 5;

        // Initialise the arrays to the correct size
        for (var y = 0; y < difficulty; y++) {
            this.map[y] = [];
            for (var x = 0; x < difficulty; x++) {
                this.map[y][x] = undefined;
            }
        }

        var position = new Phaser.Point(
            Math.floor(Math.random() * this.map[0].length),
            Math.floor(Math.random() * this.map.length)
        );

        game.spawnRoom = position;

        for (var i = 0; i < steps; i++) {
            switch(Math.floor(Math.random() * 4)) {
            case Direction.NORTH:
                if (this.checkInBounds(position.x, position.y - 1)) {
                    position.y -= 1;
                }
                break;
            case Direction.SOUTH:
                if (this.checkInBounds(position.x, position.y + 1)) {
                    position.y += 1;
                }
                break;
            case Direction.EAST:
                if (this.checkInBounds(position.x + 1, position.y)) {
                    position.x += 1;
                }
                break;
            case Direction.WEST:
                if (this.checkInBounds(position.x - 1, position.y)) {
                    position.x -= 1;
                }
                break;
            }
            this.map[position.y][position.x] = 1;
        }
        return this.map;
    }


    /**
     * Helper function to quickly check if the selected
     * coordinate is within the bounds of the map
     *
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean}
     */
    checkInBounds(x, y) {
        return x > 0 &&
               y > 0 &&
               x < this.map[0].length &&
               y < this.map.length;
    }
}
