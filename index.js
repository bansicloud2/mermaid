var walkSync = require('walk-sync');
var path = require("path");
var logger = require("./logger");


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


module.exports = function(config, mermaidMethods) {

    var app = require("./app")(config);

    app.mermaid = {};

    app.mermaid.methods = {};

    app.config = config;

    app.data = getData(config.data_directory);

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

};
