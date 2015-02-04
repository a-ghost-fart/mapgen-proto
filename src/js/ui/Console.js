function Console(game) {
    'use strict';
    this.timeSinceUpdate = 0;
    this.fadeOutTime = 10000;
    this.visible = false;
    this.linesToShow = 5;
    this.lineHeight = 15;
    this.position = new Phaser.Point(10, 10);
    this.buffer = game.add.group();
    this.buffer.createMultiple(this.linesToShow, 'bitmap_font');
    this.buffer.setAll('fixedToCamera', true);
    console.log(this.buffer);
}

Console.prototype.addMessage = function (msg) {
    'use strict';
    this.buffer.addAt(0, msg);
    this.timeSinceUpdate = 0;
};

Console.prototype.render = function (game) {
    'use strict';

    if (this.visible) {
        for (var i = 0; i < this.linesToShow; i++) {
            var text = this.game.add.bitmapText(this.position.x, this.position.y + (i * this.lineHeight), 'bitmap_font', this.buffer[i], 12);
            text.fixedToCamera = true;
        }
    }
};

Console.prototype.update = function (game) {
    'use strict';

    if (this.timeSinceUpdate > this.fadeOutTime) {
        this.visible = false;
    } else {
        this.visible = true;
    }

    this.timeSinceUpdate++;
};

module.exports = Console;
