var Quest = require('./Quest');

function Journal() {
    'use strict';
    this.quests = {
        'open': [],
        'failed': [],
        'completed': []
    };
    this.journal = [];
}


Journal.prototype.addEntry = function (text) {
    'use strict';
    this.journal.push(text);
};


Journal.prototype.getJournal = function () {
    'use strict';
    for (var i = this.journal.length - 1; i >= 0; i--) {
        console.log(this.journal[i]);
    }
};


Journal.prototype.addQuest = function (quest) {
    'use strict';
    if (quest.journalEntry !== null) {
        this.addEntry(quest.journalEntry);
    }
    this.quests.open.push(quest);
};


Journal.prototype.findQuestIndexById = function (id) {
    'use strict';
    var index = null;
    for (var i = 0; i < this.quests.open.length; i++) {
        if (this.quests.open[i].id === id) {
            index = i;
        }
    }
    return index;
};


Journal.prototype.completeQuest = function (id) {
    'use strict';
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
};


Journal.prototype.failQuest = function (id) {
    'use strict';
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
};


module.exports = Journal;
