import {Quest} from './Quest';

export class Journal {
    constructor() {
        this.quests = {
            'open': [],
            'failed': [],
            'completed': []
        };
        this.journal = [];
    }


    addEntry(text) {
        this.journal.push(text);
    }


    getJournal() {
        for (var i = this.journal.length - 1; i >= 0; i--) {
            console.log(this.journal[i]);
        }
    }


    addQuest(quest) {
        if (quest.journalEntry !== null) {
            this.addEntry(quest.journalEntry);
        }
        this.quests.open.push(quest);
    }


    findQuestIndexById(id) {
        var index = null;
        for (var i = 0; i < this.quests.open.length; i++) {
            if (this.quests.open[i].id === id) {
                index = i;
            }
        }
        return index;
    }


    completeQuest(id) {
        if (!id) {
            throw new Error('You must supply an id for a quest to complete.');
        }
        var index = this.findQuestIndexById(id);
        if (index === null) {
            throw new Error('Cannot complete quest with id "' + id + '" as it is not found.');
        }
        this.quests.open[index].complete();
        this.quests.completed.push(this.quests.open[index]);
        this.quests.open.splice(index, 1);
    }


    failQuest(id) {
        if (!id) {
            throw new Error('You must supply an id for a quest to fail.');
        }
        var index = this.findQuestIndexById(id);
        if (index === null) {
            throw new Error('Cannot fail quest with id "' + id + '" as it is not found.');
        }
        this.quests.open[index].fail();
        this.quests.failed.push(this.quests.open[index]);
        this.quests.open.splice(index, 1);
    }
}
