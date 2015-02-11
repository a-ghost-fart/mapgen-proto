function TestUI(player) {
    'use strict';
    this.viewport = document.getElementById('ui-viewport');
    this.value = player.position.x;

    this.test = React.createClass({
        'render': function () {
            return React.DOM.div(
                null,
                React.DOM.div(null, this.value)
            );
        }
    });
}

TestUI.prototype.render = function (player) {
    'use strict';
    this.value = player.position.x;
    React.renderComponent(React.createComponent(this.test), this.viewport);
};

module.exports = TestUI;
