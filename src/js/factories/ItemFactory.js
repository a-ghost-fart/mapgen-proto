import {Item} from '../items/Item';

/**
 * Simple factory to generate test items,
 * might well be destroyed in favour of
 * an item database.
 *
 * @module ItemFactory
 * @readonly
 */
export var ItemFactory = {
    /**
     * Generates a simple test item
     *
     * @inner
     * @return {Item}
     */
    'generateItem': function (game, x, y) {
        'use strict';
        return new Item(game, x, y, 'Test item', 'This is a test item.');
    }
};
