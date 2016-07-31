var _ = require("lodash");
var graph = require('fbgraph');
var Utils = require("../../utils");
var logger = require("../../logger");

var userHash = {};
var SERVICE = "facebook";

var facebookCreateUser = function(app) {

    graph.setAccessToken(app.config.facebook.PAGE_TOKEN);

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
                type: SERVICE
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

                    graph.get(platformId, function(err, fb_data) {

                        if (err) {
                            logger.error(err);
                        }

                        var profileData = {
                            first_name: fb_data.first_name,
                            last_name: fb_data.last_name,
                            profile_image_url: fb_data.profile_pic,
                            gender: fb_data.gender,
                            timezone: fb_data.timezone,
                            platform: {
                                id: platformId
                            }
                        };

                        data = _.extend(data, profileData);

                        app.service("/v1/users").create(data).then(function(user) {

                            logger.info("Added new Facebook user to database");

                            logger.debug("Updating local in-memory hash");

                            userHash[userId] = user;

                            return next();

                        }).catch(function(err) {
                            logger.error(err);
                        })

                    })

                }

            }).catch(function(err) {
                logger.error(err);
            })

        }

    }
};

module.exports = facebookCreateUser;
