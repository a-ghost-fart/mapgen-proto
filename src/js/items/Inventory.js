import {ItemType} from '../enums/ItemType';

/**
 * Creates an inventory to handle both what items
 * are collected / dropped / destroyed but also
 * which slot they exist in for the ui.
 *
 * @constructor
 * @param {Number} size - Size of the inventory to create
 */
export class Inventory {
    constructor(size) {
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
    drop(slot) {
        if (!slot) {
            throw new Error('No slot defined, cannot drop item.');
        }
        var item = this.items[slot];
        this.items[slot] = undefined;
        return item;
    }


    /**
     * Add item to specified slot, or first available
     * if not specified
     *
     * @method
     * @param {Item} item
     * @param {Number} slot
     */
    add(item, slot) {
        if (!item) {
            throw new Error('Cannot add item to inventory as no item supplied.');
        }
        if (!slot) {
            var s = this.findEmptySlot();
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
    }


    /**
     * Activates the item in the selected slot
     *
     * @method
     * @param {Number} slot
     * @return {undefined}
     */
    useItem(slot) {
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
    }


    /**
     * Finds the first available empty slot.
     *
     * @method
     * @return {Number}
     */
    findEmptySlot() {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] === undefined) {
                return i;
            }
        }
        return null;
    }


    /**
     * Returns the item found in the specified slot.
     *
     * @method
     * @param {Number} slot
     * @return {Item}
     */
    getItemInSlot(slot) {
        if (!this.items[slot]) {
            throw new Error('No item found in slot ' + slot);
        } else {
            return this.items[slot];
        }
    }


    /**
     * List all items in the inventory
     *
     * @method
     * @todo - make this do something
     * @return {undefined}
     */
    list() {
        console.log(this.items);
    }
}

export default Inventory;
