import {MessageLog} from './MessageLog';

export class UI {

    constructor() {
        this.messageLog = new MessageLog();
    }

    addMessage(msg) {
        this.messageLog.addMessage(msg);
    }

    render() {
        this.messageLog.render();
    }

}
