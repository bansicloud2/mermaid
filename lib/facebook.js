var async = require("async");
var request = require("request");
var config = require("../config");
var _ = require("lodash");

var ACCESS_TOKEN = config && config.facebook && config.facebook.PAGE_TOKEN;

module.exports = {
    persistentMenu: function(next) {
        if (config.facebook && config.facebook.persistent_menu) {
            request({
                uri: "https://graph.facebook.com/v2.6/me/thread_settings?access_token=" + ACCESS_TOKEN,
                json: true,
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: {
                    "setting_type": "call_to_actions",
                    "thread_state": "existing_thread",
                    "call_to_actions": _.map(config.facebook.persistent_menu.buttons, function(button) {
                        return {
                            "type": "postback",
                            "title": button.title,
                            "payload": button.payload
                        }
                    })
                }
            }, function(err, res, body) {

                if (err) {
                    console.error(err);
                    next(err);
                } else {
                    console.log(body.result);
                    next();
                }

            });
        } else {
            next();
        }
    },
    greetingText: function(next) {
        if (config.facebook && config.facebook.getting) {
            request({
                uri: "https://graph.facebook.com/v2.6/me/thread_settings?access_token=" + ACCESS_TOKEN,
                json: true,
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: {
                    "setting_type": "greeting",
                    "greeting": {
                        "text": config.facebook.greeting.text
                    }
                }
            }, function(err, res, body) {

                if (err) {
                    console.error(err);
                    next(err);
                } else {
                    console.log(body.result);
                    next();
                }

            });
        } else {
            next()
        }
    },
    greetingPayload: function(next) {
        if (config.facebook && config.facebook.greeting) {
            request({
                uri: "https://graph.facebook.com/v2.6/me/thread_settings?access_token=" + ACCESS_TOKEN,
                json: true,
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: {
                    "setting_type": "call_to_actions",
                    "thread_state": "new_thread",
                    "call_to_actions": [{
                        "payload": config.facebook.greeting.payload
                    }]
                }
            }, function(err, res, body) {

                if (err) {
                    console.error(err);
                    next(err);
                } else {
                    console.log(body.result);
                    next();
                }

            });
        } else {
            next();
        }
    },
    reactivateFacebook: function(next) {
        if (config.facebook) {
            request.post("https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=" + ACCESS_TOKEN,
                function(err, res, body) {

                    if (err) {
                        console.error(err);
                        return next && next(err);
                    } else {

                      var isSuccess = JSON.parse(body).success;

                        if (isSuccess) {

                            console.log("Pinged Facebook endpoint for service: " + config.company);

                            return next && next();

                        } else {
                            console.error("Something went wrong.");
                            return next("Something went wrong.");
                        }

                    }

                });
        } else {
            return next && next();
        }
    }
};
