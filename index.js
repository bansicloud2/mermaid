//CONFIG===============================================
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

module.exports = function(app, config) {

    app.botkit = {};

    config.services.forEach(function(serviceName) {
        require("./services/" + serviceName)(app);
    });

    app.botkit.findConvo = function(id, service) {

        return findConvo(app.botkit[service], id);

    };

};
