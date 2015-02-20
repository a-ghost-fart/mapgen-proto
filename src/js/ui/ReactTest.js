export class TestUI {
    constructor(player) {
        this.viewport = document.getElementById('ui-viewport');
        this.value = player.position.x;

        this.test = React.createClass({
            'render': function () {
                return (
                    <div>
                        hello there
                    </div>
                );
            }
        });
    }


    render(player) {
        this.value = player.position.x;
        React.render(this.test, this.viewport);
    }
}
