var Class = require('class-extend');
var Validator = require("../validator");
var async = require("async");
var Utils = require("../../../utils");
var logger = require("../../../logger");
var _ = require("lodash");

var BaseTemplate = Class.extend({

    getMessages: function(stateManager) {

        var message = stateManager.context.prompt;

        if (_.isString(message)) {
            message = {
                text: message
            }
        }

        message = Object.assign({}, message, {
            keywords: stateManager.context.keywords
        })

        return [message];

    },

    getPatternCatcher: function(stateManager) {

        var patternCatcher = [{
            default: true,
            callback: function(response, convo) {

                convo.response = response.text;

                logger.info("Setting response value to '%s'", convo.response);

                if (stateManager.context.validators) {

                    var value = response.text;

                    async.eachSeries(stateManager.context.validators, function(validator, done) {

                        var validator = new Validator(stateManager.app, validator, stateManager.context.uri);

                        validator.validate(value, function(err, overrideValue) {

                            if (overrideValue) {
                                logger.info("Setting override value with: %s", JSON.stringify(overrideValue, null, 2));
                                convo.overrideValue = overrideValue;
                            }

                            return done(err);

                        });

                    }, function(err) {

                        if (err) {

                            if (err.route) {

                                stateManager.workflowController.route(err.route);
                                convo.stop();

                            } else {

                                convo.repeat();
                                convo.next();

                            }

                        } else {

                            convo.next();
                        }

                    });

                } else {
                    convo.next();
                }
            }
        }];

        return patternCatcher;

    },

    getURIForResponse: function(stateManager) {
        return stateManager.context["next-uri"];
    },

    getEnd: function(stateManager, callback) {

        return function(convo) {

            var response = convo.response;

            if (convo.status == 'completed') {

                var platform = stateManager.bot.type,
                    platform_id = stateManager.message.user,
                    id = Utils.getUserId(platform, platform_id),
                    next_uri = stateManager.getURIForResponse(response);

                stateManager.controller.storage.users.update({
                    id: id
                }, {
                    system: {
                        last_uri: stateManager.context.uri
                    }
                }, function(err, id) {

                    if (err) {
                        logger.error(err);
                    }

                    return callback && callback(null, next_uri);
                });


            } else {
                logger.warn("The conversation ended abruptly for another reason.")
            }
        }
    }

});

module.exports = BaseTemplate;
