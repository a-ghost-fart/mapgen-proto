export class TestUI {
    constructor(player) {
        this.viewport = document.getElementById('ui-viewport');
        this.value = player.position;

        this.test = React.createClass({
            'render': function () {
                return (
                    <div>x: {this.props.pos.x} y: {this.props.pos.y}</div>
                );
            }
        });
    }


    render(player) {
        this.value = player.position;
        React.render(<this.test pos={this.value}/>, this.viewport);
    }
}
