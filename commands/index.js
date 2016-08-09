var Utils = require("../utils");
var Messenger = require("../messenger");
var logger = require("../logger");
var WorkflowController = require("../workflow");
var _ = require("lodash");

var Commands = function(app, controller) {
    this.app = app;
    this.controller = controller;
};

Commands.prototype.init = function(events) {

    var commands = this.get(this.app, this.controller);

    for (var key in commands) {

        var command = commands[key];

        logger.info("Setting up command: %s", key);

        if (command.options) {
            this.controller.hears(command.options, events, command.action);

        } else {
            this.controller.on(events, command.action);
        }

    }
};

Commands.prototype.getCommandsForPatternCatcher = function(bot, message) {

    var patterns = [];

    var commands = this.get(this.app, this.controller);

    _.each(commands, (command, key) => {

        if (command.options) {

            command.options.forEach((regex) => {

                patterns.push({
                    pattern: new RegExp(regex),
                    callback: (response, convo) => {

                        convo.exit_response = command.exit_response;

                        convo.next();

                        setTimeout(() => {

                            logger.debug(key);

                            if (command.action) {
                                command.action.call(this, bot, response);
                            }

                        }, 1000);

                    }
                })

            });

        }


    });

    return patterns;

};

Commands.prototype.get = function() {

    var commands = {
        "start": {
            options: [/hello/gi, /^hi$/gi, /$start/gi, /go$/gi, /^hey/gi, /yo$/],

            exit_response: "✨✨✨",

            action: (bot, message) => {

                var service = Utils.getService(bot);

                if (service && message.user) {

                    var commandsForPatternCatcher = this.getCommandsForPatternCatcher(bot, message);

                    var workflowController = new WorkflowController(this.app, this.controller, bot, message, commandsForPatternCatcher);

                    var messenger = new Messenger(this.app, bot, message);

                    messenger.recordMessageInDB(message, "received", null);

                    workflowController.route("/");


                }

            }
        },

        "goto": {
            options: ["goto (.*)$"],

            exit_response: this.app.config.goto_message,

            action: (bot, message) => {

                var route = message.match[1];

                logger.debug("Selecting to go to route: %s", route);

                var service = Utils.getService(bot);

                if (service && message.user) {

                    var commandsForPatternCatcher = this.getCommandsForPatternCatcher(bot, message);

                    var workflowController = new WorkflowController(this.app, this.controller, bot, message, commandsForPatternCatcher);

                    var messenger = new Messenger(this.app, bot, message);

                    messenger.recordMessageInDB(message, "received", null);

                    workflowController.route(route).catch((e) => {

                        logger.error(e);

                        messenger.reply({
                            text: e.message
                        })
                    });

                }

            }
        },

        "pwd": {

            options: [/where am i$/gi, /^current path$/gi, /^pwd$/gi],

            exit_response: "Showing you where you are in workflow...",

            action: (bot, message) => {

                var service = Utils.getService(bot);
                var userId = Utils.getUserId(service, message.user)

                if (service && message.user) {

                    this.app.service("/v1/users").get(userId).then((user) => {

                        var messenger = new Messenger(this.app, bot, message);

                        messenger.recordMessageInDB(message, "received", null);

                        messenger.reply({
                            text: user.system.current_uri,
                        }, "/");


                    });

                }

            }

        },

        "last": {
            options: [/^last$/gi, /^back$/gi, /^b$/gi],

            exit_response: "Taking you to last stage in workflow...",

            action: (bot, message) => {

                var service = Utils.getService(bot);
                var userId = Utils.getUserId(service, message.user);

                var commandsForPatternCatcher = this.getCommandsForPatternCatcher(bot, message);

                var workflowController = new WorkflowController(this.app, this.controller, bot, message, commandsForPatternCatcher);

                if (service && message.user) {

                    this.app.service("/v1/users").get(userId).then((user) => {

                        var last_uri = user.system.last_uri;

                        workflowController.route(last_uri);

                    });

                }

            }
        },

        "restart": {
            options: [/^restart$/gi, /^refresh$/gi, /^reset$/gi],

            exit_response: this.app.config.restart_message,

            action: (bot, message) => {

                var service = Utils.getService(bot);
                var userId = Utils.getUserId(service, message.user);

                var commandsForPatternCatcher = this.getCommandsForPatternCatcher(bot, message);

                var workflowController = new WorkflowController(this.app, this.controller, bot, message, commandsForPatternCatcher);

                if (service && message.user) {

                    var query = {
                        session: {}
                    };

                    logger.info("Resetting the session");

                    logger.debug("Updating userId : %s with following query: %s", userId, JSON.stringify(query))

                    this.app.service("/v1/users").update(userId, query, {}).then(function() {

                        workflowController.route("/");

                    }.bind(this));

                }

            }
        },

        "quit": {
            options: [/^quit$/gi, /^stop$/gi, /^bye$/gi],
            exit_response: "Bye Bye 👋👋"
        },

        "help": {
            options: [/^help$/gi],
            action: (bot, message) => {

                this.app.mermaid.methods.messageTeam("Someone is asking for help in the platform.");

                var messenger = new Messenger(this.app, bot, message);

                messenger.reply({
                    text: "I've notified my team of experts. Someone should assist you shortly."
                });
            }
        },

        "show-routes": {
            options: [/^show routes$/gi],
            exit_response: "You better be an admin...",
            action: (bot, message) => {

                var messenger = new Messenger(this.app, bot, message);

                var routes = _.reduce(Object.keys(this.app.mermaid.data), (result, route) => {
                    return result += route + "\n"
                }, "");

                messenger.reply({
                    text: routes
                });

            }

        },

        "default": {
            action: (bot, message) => {

                var sendDefaultMessage = () => {

                    var messenger = new Messenger(this.app, bot, message);

                    messenger.recordMessageInDB(message, "received", null);

                    messenger.reply({
                        text: this.app.config.opening_message
                    }, "/");

                }

                logger.debug("Running default command");

                var service = Utils.getService(bot);

                var userId = Utils.getUserId(service, message.user);

                this.app.service("/v1/users").get(userId).then((user) => {

                    if (user && user.triggers && user.triggers[message.text]) {

                        var route = user.triggers[message.text];

                        var commandsForPatternCatcher = this.getCommandsForPatternCatcher(bot, message);

                        var workflowController = new WorkflowController(this.app, this.controller, bot, message, commandsForPatternCatcher);

                        workflowController.route(route);

                    } else {
                        sendDefaultMessage();
                    }

                }).catch((e) => console.error(e));

            }
        }

    };

    return commands;

}



module.exports = Commands;
