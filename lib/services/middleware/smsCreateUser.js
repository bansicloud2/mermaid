var _ = require("lodash");
var Utils = require("../../utils");
var logger = require("../../logger");

var userHash = {};
var SERVICE = "sms";

var smsCreateUser = function(app) {

    return function(bot, message, next) {

        logger.debug("Running userAdder middleware for Facebook Service.");

        var platformId = message.user;

        var userId = Utils.getUserId(SERVICE, platformId);

        if (userHash[userId]) {
            logger.debug("Already have in in-memory hash");
            next();
        } else {

            var data = {
                id: userId,
                type: SERVICE,
                platform: {
                  id : platformId
                }
            };

            app.service("/v1/users").find({
                query: {
                    id: data.id
                }
            }).then(function(users) {

                var user = users.data[0];

                if (user) {

                    logger.debug("Already have user in DB.");

                    logger.debug("Updating local in-memory hash...");

                    userHash[userId] = user;

                    return next();

                } else {

                    app.service("/v1/users").create(data).then(function(user) {

                        logger.info("Added new SMS user to database");

                        logger.debug("Updating local in-memory hash");

                        userHash[userId] = user;

                        return next();

                    }).catch(function(err) {
                        logger.error(err);
                    })
                }

            }).catch(function(err) {
                logger.error(err);
            })

        }

    }
};

module.exports = smsCreateUser;
