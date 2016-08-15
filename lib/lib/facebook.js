var async = require("async");
var request = require("request");
var _ = require("lodash");
var logger = require("../logger");

module.exports = function(config) {
    return {
        persistentMenu: function(next) {
            if (config.facebook && config.facebook.persistent_menu) {
                request({
                    uri: "https://graph.facebook.com/v2.6/me/thread_settings?access_token=" + config.facebook.PAGE_TOKEN,
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
                        logger.error(err);
                        next(err);
                    } else {
                        logger.info(body.result);
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
                    uri: "https://graph.facebook.com/v2.6/me/thread_settings?access_token=" + config.facebook.PAGE_TOKEN,
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
                        logger.error(err);
                        next(err);
                    } else {
                        logger.info(body.result);
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
                    uri: "https://graph.facebook.com/v2.6/me/thread_settings?access_token=" + config.facebook.PAGE_TOKEN,
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
                        logger.error(err);
                        next(err);
                    } else {
                        logger.info(body.result);
                        next();
                    }

                });
            } else {
                next();
            }
        },
        reactivateFacebook: function(next) {
            if (config.facebook) {
                request.post("https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=" + config.facebook.PAGE_TOKEN,
                    function(err, res, body) {

                        if (err) {
                            logger.error(err);
                            return next && next(err);
                        } else {

                            var isSuccess = JSON.parse(body).success;

                            if (isSuccess) {

                                logger.info("Pinged Facebook endpoint for service: " + config.company);

                                return next && next();

                            } else {
                                return next("Was unable to successfully ping Facebook endpoint with following token: " + config.facebook.PAGE_TOKEN);
                            }

                        }

                    });
            } else {
                return next && next();
            }
        }
    };

}
