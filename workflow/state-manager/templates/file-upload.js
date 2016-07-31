var _ = require("lodash");
var BaseTemplate = require("./base");
var ejs = require("ejs");
var logger = require("../../../logger");

var FileUploadTemplate = BaseTemplate.extend({

    getPatternCatcher: function(stateManager) {

        var patternCatcher = [{
            default: true,
            callback: function(response, convo) {
                if (response.file) {
                    convo.next();
                } else {

                    convo.repeat();
                    convo.next();

                }
            }
        }];

        return patternCatcher;
    },

    getEnd: function(stateManager, controller, chat_controller, bot, message, callback) {

        var self = this;

        return function(convo) {

            if (convo.status == 'completed') {

                controller.storage.users.get({
                    "platform.id": message.user
                }, function(err, user) {

                  if(err){
                    logger.error("Couldn't retreive user: %s", err);
                  }

                    user[stateManager.context["file-url-field"]] = convo.responses["response"].file.url_private_download;

                    controller.storage.users.save(user, function(err, id) {

                        if (err) {
                            logger.error("Couldn't save user using storage controller:", err);
                        }

                        FileUploadTemplate.__super__.getEnd(stateManager, controller, chat_controller, bot, message, callback)(convo);

                    });
                });

            } else {
                logger.warn("The conversation ended abruptly.")
            }
        }
    }


});

module.exports = FileUploadTemplate;
