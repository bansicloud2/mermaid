var _ = require("lodash");
var BaseTemplate = require("./base");
var ejs = require("ejs");
var logger = require("../../../logger");
var Utils = require("../../../utils");

var CheckOutTemplate = BaseTemplate.extend({

    getPatternCatcher: function(stateManager) {

        var patternCatcher = [{
            default: true,
            callback: function(response, convo) {
                convo.repeat();
                convo.next();
            }
        }];

        return patternCatcher;
    },

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

                data[stateManager.context["storage-property"]] = true;

                stateManager.controller.storage.users.update(query, data,
                    function(err, id) {

                        if (err) {
                            logger.error("Couldn't update user using storage controller : %s",err);
                        }

                        CheckOutTemplate.__super__.getEnd(stateManager, callback)(convo);

                    });


            } else {
                logger.warn("The conversation ended abruptly.")
            }
        }
    }


});

module.exports = CheckOutTemplate;
