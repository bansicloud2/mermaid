var _ = require("lodash");
var LetteredOptionsTemplate = require("./lettered-options");

var NumberedListTemplate = LetteredOptionsTemplate.extend({

    getMessages: function(stateManager) {

        var options = "";

        for (var n in stateManager.context.options) {

            var option = stateManager.context.options[n]
            var value =  _.isString(option) ? option : option.text;

            options = options.concat(n + ". " + value  + "\n");
        }

        return [ { text : stateManager.context.prompt }, { text : options } ];

    }

});

module.exports = NumberedListTemplate;
