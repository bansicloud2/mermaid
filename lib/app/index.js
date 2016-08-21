var os = require('os');
var path = require("path");

// modules =================================================
var feathers = require('feathers');
var rest = require('feathers-rest');
var socketio = require('feathers-socketio');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoose = require("mongoose");
var services = require("./services");
var logger = require("./logger");
var authentication = require("feathers-authentication");
var routes = require("./routes");

// configuration ===========================================

module.exports = function(config) {

    var app = feathers();

    // Add REST API support
    app.configure(rest());
    app.configure(hooks());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.configure(socketio({
        path: '/ws'
    }));
    app.configure(services);
    app.configure(authentication({
        userEndpoint: "/v1/admins",
        local: {
            usernameField: 'email',
        },
        token: {
            secret: 'my-secret'
        }
    }));

    // view engine ejs
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, './views'));
    // public folder for images, css,...
    app.use(feathers.static(path.join(__dirname, './public')));


    // // routes
    routes(app, config);

    mongoose.connect(config.db);

    mongoose.Promise = global.Promise;

    //START ===================================================
    app.listen(config.api.port, function() {

        logger.info('Mermaid API server listening on port ' + config.api.port);
    });

    return app;

}
