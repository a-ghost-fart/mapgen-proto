export class MessageLog {

    constructor() {
        this.messageCount = 5;

        this.messages = [];
        this.messages.length = this.messageCount; // Necessary because of the slice below

        var _this = this;
        this.MessageLog = React.createClass({
            'render': function () {
                var messages = _this.messages.slice(Math.max(_this.messages.length - _this.messageCount, 1));
                return (
                    <ul className="console">
                        {messages}
                    </ul>
                );
            }
        });

        this.Message = React.createClass({
            'render': function () {
                return (
                    <li>{this.props.msg}</li>
                );
            }
        });

    }

    addMessage(msg) {
        this.messages.push(<this.Message msg={msg}/>);
    }

    render() {
        React.render(<this.MessageLog/>, document.getElementById('ui-viewport'));
    }

}
