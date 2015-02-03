var testMap = [
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0]
];

/**
 * Utility class with helper methods for
 * generating maps
 *
 * @constructor
 */
function MapFactory(game) {}


/**
 * Generates a map layout for the current world represented
 * by a two dimensional array;
 *
 * @todo At present just outputs the testMap variable because this is still a WIP
 *
 * @static
 * @return {Array} Two dimensional array representing a map
 */
MapFactory.prototype.generate = function () {
    'use strict';
    return testMap;
};

module.exports = MapFactory;
