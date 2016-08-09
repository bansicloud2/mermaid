var _ = require("lodash");
var NumberedListTemplate = require("./numbered-list");
var logger = require("../../../logger");
var Utils = require("../../../utils");

var MultipleChoiceQuestionTemplate = NumberedListTemplate.extend({

    getEnd: function(stateManager, callback) {

        var self = this;

        return function(convo) {

            if (convo.status == 'completed') {

                var platform = stateManager.bot.type,
                    platform_id = stateManager.message.user,
                    id = Utils.getUserId(platform, platform_id),
                    query = {
                        id: id
                    },
                    data = {};


                data[stateManager.context["storage-property"]] = self.getValueForResponse(stateManager, convo.response);

                // logger.debug("Update query going into users collection: %s", JSON.stringify(data, null, 4));

                stateManager.controller.storage.users.update(query, data, function(err, id) {

                    if (err) {
                        logger.error(err);
                    }

                    MultipleChoiceQuestionTemplate.__super__.getEnd(stateManager, callback)(convo);

                });


            } else {
                logger.warn("The conversation ended abruptly.")
            }
        }
    },

    getValueForResponse: function(stateManager, response) {
        return stateManager.context.options[response.toLowerCase()];
    }
});

module.exports = MultipleChoiceQuestionTemplate;
