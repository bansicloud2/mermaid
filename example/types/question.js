var BaseTemplate = require("../../lib/workflow/state-manager/types/base");
var Utils = require("../../lib/utils");
var logger = require("../../lib/logger");

var ANSWER_SERVICE_URI = "/v1/answers";

var SampleInsertDocumentInDatabaseTemplate = BaseTemplate.extend({

    getEnd: function(stateManager, callback) {

        var self = this;

        return function(convo) {

            if (convo.status == 'completed') {

                var platform = stateManager.bot.type,
                    platform_id = stateManager.message.user,
                    id = Utils.getUserId(platform, platform_id);

                var answer = convo.overrideValue ? convo.overrideValue : convo.response;

                stateManager.app.service(ANSWER_SERVICE_URI).create({
                    user_id: id,
                    text: answer,
                }).then((answer) => {

                    SampleInsertDocumentInDatabaseTemplate.__super__.getEnd(stateManager, callback)(convo);

                }).catch((err) => logger.error("Error updating user using user storage controller: %s", err))

            } else {
                logger.warn("The conversation ended abruptly.")
            }
        }
    }

});

module.exports = SampleInsertDocumentInDatabaseTemplate;
