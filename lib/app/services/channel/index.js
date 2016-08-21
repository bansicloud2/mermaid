const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Channel = require('../../models/channel');
var hooks = require("feathers-hooks");
var _ = require("lodash");
const authenticationHooks = require('feathers-authentication').hooks;

module.exports = function() {
    const app = this;

    app.use('/v1/channels', service({
        name: 'channel',
        Model: Channel,
        paginate: {
            default: 100,
            max: 100
        },
        overwrite : false,
        id: "id"
    }));


    // Get our initialize service to that we can bind hooks
    const channelService = app.service('/v1/channels');

    // Set up our hooks

    channelService.before({
        all: [
            authenticationHooks.restrictToAuthenticated()
        ]
    });

};
