const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Team = require('../../models/team');
var hooks = require("feathers-hooks");
var _ = require("lodash");
const authenticationHooks = require('feathers-authentication').hooks;

module.exports = function() {
    const app = this;

    app.use('/v1/teams', service({
        name: 'team',
        Model: Team,
        paginate: {
            default: 100,
            max: 100
        },
        overwrite : false,
        id: "id"
    }));

    // Get our initialize service to that we can bind hooks
    const teamService = app.service('/v1/teams');

    teamService.before({
        all: [
            authenticationHooks.restrictToAuthenticated()
        ]
    });

    teamService.after({
        all: [service.hooks.toObject()]
    });

};
