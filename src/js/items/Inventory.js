var ItemType = require('../enums/ItemType');

/**
 * Creates an inventory to handle both what items
 * are collected / dropped / destroyed but also
 * which slot they exist in for the ui.
 *
 * @constructor
 * @param {Number} size - Size of the inventory to create
 */
function Inventory(size) {
    'use strict';
    // Yeah, correct the size for 0 indexing
    this.size = size - 1;
    this.items = new Array(size - 1);
    this.weight = 0.0;
    this._item_buffer = undefined;
}


/**
 * Drop the item in the specified slot
 *
 * @method
 * @param {Number} slot
 * @return {undefined}
 */
Inventory.prototype.drop = function (slot) {
    'use strict';
    if (!slot) {
        throw new Error('No slot defined, cannot drop item.');
    }
    var item = this.items[slot];
    this.items[slot] = undefined;
    return item;
};


/**
 * Add item to specified slot, or first available
 * if not specified
 *
 * @method
 * @param {Item} item
 * @param {Number} slot
 */
Inventory.prototype.add = function (item, slot) {
    'use strict';
    if (!item) {
        throw new Error('Cannot add item to inventory as no item supplied.');
    }
    if (!slot) {
        var s = this.find_empty_slot();
        if (s !== null) {
            this.items[s] = item;
        } else {
            console.log('No free slot found, inventory full!');
        }
    } else {
        if (slot > this.size) {
            throw new Error('Attempted to add item to slot ' + slot + ' but that is beyond the inventory size.');
        }
        if (this.items[slot] !== undefined) {
            throw new Error('Cannot add item to slot ' + slot + ' as there is already an item there.');
        } else {
            this.items[slot] = item;
        }
    }
};


/**
 * Activates the item in the selected slot
 *
 * @method
 * @param {Number} slot
 * @return {undefined}
 */
Inventory.prototype.useItem = function (slot) {
    'use strict';
    try {
        var item = this.getItemInSlot(slot);
        if (item.type === ItemType.CONSUMABLE) {
            console.log('it\'s a consumable');
        } else if (item.type === ItemType.ARMOUR) {
            console.log('it\'s armour');
        } else if (item.type === ItemType.WEAPON) {
            console.log('it\'s a weapon');
        }
    } catch (e) {
        console.error(e);
    }
};


/**
 * Finds the first available empty slot.
 *
 * @method
 * @return {Number}
 */
Inventory.prototype.findEmptySlot = function () {
    'use strict';
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] === undefined) {
            return i;
        }
    }
    return null;
};


/**
 * Returns the item found in the specified slot.
 *
 * @method
 * @param {Number} slot
 * @return {Item}
 */
Inventory.prototype.getItemInSlot = function (slot) {
    'use strict';
    if (!this.items[slot]) {
        throw new Error('No item found in slot ' + slot);
    } else {
        return this.items[slot];
    }
};


/**
 * List all items in the inventory
 *
 * @method
 * @todo - make this do something
 * @return {undefined}
 */
Inventory.prototype.list = function () {
    'use strict';
    console.log(this.items);
};


module.exports = Inventory;
