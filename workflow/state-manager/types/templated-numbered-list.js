var _ = require("lodash");
var NumberedListTemplate = require("./numbered-list");

var TemplatedNumberedListTemplate = NumberedListTemplate.extend({

    getMessages: function(stateManager) {

        return [{ text: stateManager.context.prompt }, { attachments: stateManager.context.options }];

    }

});

module.exports = TemplatedNumberedListTemplate;
