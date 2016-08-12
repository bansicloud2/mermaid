var Slack = require('slack-node');
var _ = require("lodash");
var logger = require("../../logger");
var Q = require("q");

module.exports = function(app) {

    var slack = new Slack(app.config.slack.SLACK_CLIENT_ID);

    return {
        users: {
            addProfileData: function(user) {

                var deferred = Q.defer();

                logger.debug("Data going into addProfileData : %s", JSON.stringify(user, null, 4));

                var authObj = {
                    user: user.id,
                    token: user.access_token
                };

                slack.api("users.info", authObj, function(err, slackData) {

                    if (err) {
                        return deferred.reject(err);
                    }

                    logger.debug("Slack data from API request: %s", JSON.stringify(slackData, null, 4));

                    var profileData = _.extend(user, {
                        id: "slack-" + user.id,
                        first_name: slackData.user.profile.first_name,
                        last_name: slackData.user.profile.last_name,
                        email: slackData.user.profile.email,
                        profile_image_url: slackData.user.profile.image_512,
                        type: "slack",
                        platform: {
                            id: user.id,
                            user: user.user,
                            access_token: user.access_token,
                            scopes: user.scopes,
                            team_id: user.team_id
                        }
                    });

                    delete user['user']
                    delete user['access_token']
                    delete user['scopes']
                    delete user['team_id']

                    deferred.resolve(profileData);

                });

                return deferred.promise;

            }
        }
    }
}
