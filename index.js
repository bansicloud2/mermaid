var walkSync = require('walk-sync');
var path = require("path");
var logger = require("./logger");
var async = require("async");
var facebook = require("./lib/facebook");
var lighttunnel = require("./lib/lighttunnel");


var findConvo = function(botkit, id) {

    var tasks = botkit.tasks;

    for (var i = 0; i < tasks.length; i++) {

        var task = tasks[i];

        var convos = task.convos;

        for (var j = 0; j < convos.length; j++) {

            var convo = convos[j];

            if (convo.id === id) {
                return convo;
            }
        }
    }

};

var getData = function(directory) {

    logger.info("Getting data from data directory: %s", directory);

    var data = {};

    var files = walkSync(directory);

    files.forEach(function(file) {

        if (path.extname(file) === ".json") {

            file = directory + "/" + file;

            var json = require(file);
            var uri = json.uri;

            data[uri] = json;
        }
    })

    return data;
}


var getValidators = function(localValidatorsDirectory) {

    var validators = {};

    var directory = __dirname + "/workflow/state-manager/validator/validators";

    logger.info("Setting up validators...");

    var baseValidators = walkSync(directory);

    baseValidators.forEach(function(file) {

        if (path.extname(file) === ".js") {

            file = directory + "/" + file;

            var validator = require(file);

            var name = path.basename(file, '.js')

            validators[name] = validator;
        }
    });

    var localValidators = walkSync(localValidatorsDirectory)

    localValidators.forEach(function(file) {

        if (path.extname(file) === ".js") {

            file = localValidatorsDirectory + "/" + file;

            var validator = require(file);

            var name = path.basename(file, '.js')

            validators[name] = validator;
        }
    });

    return validators;

}

var getTemplates = function(directory) {

    var templates = {};

    directory = directory || __dirname + "/workflow/state-manager/templates";

    logger.info("Setting up templates...");

    var baseTemplates = walkSync(directory);

    baseTemplates.forEach(function(file) {

        if (path.extname(file) === ".js") {

            file = directory + "/" + file;

            var template = require(file);

            var name = path.basename(file, '.js')

            templates[name] = template;
        }
    });

    return templates;

};

var setupFacebook = function(config) {

    var f = facebook(config)

    var setup_functions = Object.keys(f).map(function(key) {
        return f[key]
    });

    async.series(setup_functions, function(err, result) {
        if (err) {
            logger.error(err);
        } else {
            logger.info("Setup Facebook.");
        }
    });

};


module.exports = function(config, mermaidMethods) {

    var app = require("./app")(config);

    app.mermaid = {};

    app.mermaid.methods = {};

    app.config = config;

    app.data = getData(config.data_directory);

    app.mermaid.validators = getValidators(config.validators_directory);

    app.mermaid.templates = getTemplates();

    if (config.facebook) {
        setupFacebook(config);
    }

    // if(config.env === "development" && config.bundle){
    //   lighttunnel.start(config.bundle.port)
    // }

    Object.assign(app.mermaid.methods, {

        messageTeam: function(message) {
            var mailgun = require('mailgun-js')({
                apiKey: config.mailgun.apiKey,
                domain: config.mailgun.domain
            });

            var data = {
                to: config.admin_emails,
                from: 'No-Reply <noreply@mg.sagebots.com>',
                subject: config.company + ' Bot Alert',
                text: message
            };

            mailgun.messages().send(data, function(err, body) {
                if (err) {
                    logger.error("Error sending message using mailgun: %s", err);
                } else {
                    logger.info("E-mail sent to team.");
                }
            });
        }

    }, mermaidMethods);

    config.services.forEach(function(serviceName) {
        require("./services/" + serviceName)(app, config);
    });

    app.mermaid.findConvo = function(id, service) {

        return findConvo(app.mermaid[service], id);

    };

    app.mermaid.getTemplate = function(type) {
        return new app.mermaid.templates[type]();
    }

    app.mermaid.use = function(plugin) {

        app.mermaid.templates = Object.assign(app.mermaid.templates, getTemplates(plugin.config.templateDirectory));

    };

    return app.mermaid;

};
