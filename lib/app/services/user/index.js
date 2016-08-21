const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const User = require('../../models/user');
var _ = require("lodash");
const authenticationHooks = require('feathers-authentication').hooks;

module.exports = function() {
    const app = this;

    app.use('/v1/users', service({
        name: 'user',
        Model: User,
        paginate: {
            default: 100,
            max: 100
        },
        overwrite: false,
        id: "id"
    }));

    // Get our initialize service to that we can bind hooks
    const userService = app.service('/v1/users');

    userService.before({
        all: [
            authenticationHooks.restrictToAuthenticated()
        ]
    });

    // Set up our before hooks
    userService.after({
        all: [service.hooks.toObject()]
    });

};
