import {QuestUtil} from '../util/QuestUtil';

export class Quest {
    constructor(name, description, xpReward, itemReward, journalEntry) {
        this.name = name;
        this.description = description;
        this.xpReward = xpReward;
        this.itemReward = itemReward
            ? itemReward
            : null;
        this.journalEntry = journalEntry
            ? journalEntry
            : null;
        this.id = QuestUtil.generateQuestId(this.name);
    }


    complete() {
        console.log('completed quest: ', this);
    }


    fail() {
        console.log('failed quest: ', this);
    }
}
