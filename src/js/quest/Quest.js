var QuestUtil = require('../util/QuestUtil');

function Quest(name, description, xpReward, itemReward, journalEntry) {
    'use strict';
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

Quest.prototype.complete = function () {
    'use strict';
    console.log('completed quest: ', this);
};

Quest.prototype.fail = function () {
    'use strict';
    console.log('failed quest: ', this);
};

module.exports = Quest;
