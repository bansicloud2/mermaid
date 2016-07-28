var _ = require("lodash");
var BaseTemplate = require("./base");
var Utils = require("../../../utils");
var dot = require("dot-object");
var logger = require("../../../../../logger")

var StoreInformationTemplate = BaseTemplate.extend({

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

                var storageValue = convo.overrideValue ? convo.overrideValue : convo.response;

                data[stateManager.context["storage-property"]] = storageValue;

                logger.info("Updating user controller with following query and data respectively: %s, %s", JSON.stringify(data, null, 4), JSON.stringify(query, null, 4));

                stateManager.controller.storage.users.update(query, data,
                    function(err, id) {

                        if (err) {
                            logger.error("Error updating user using user storage controller: %s", err);
                        }

                        StoreInformationTemplate.__super__.getEnd(stateManager, callback)(convo);

                    });


            } else {
                logger.warn("The conversation ended abruptly.")
            }
        }
    }
});

module.exports = StoreInformationTemplate;
