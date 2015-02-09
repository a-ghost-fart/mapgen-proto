var Item = require('../items/Item');

module.exports = {
    'generateItem': function (game, x, y) {
        'use strict';
        return new Item(game, x, y, 'Test item', 'This is a test item.');
    }
};
