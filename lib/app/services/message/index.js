const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Message = require('../../models/message');
var logger = require("../../logger");
var Messenger = require("../../../messenger");
const authenticationHooks = require('feathers-authentication').hooks;

module.exports = function() {

    const app = this;
    app.use('/v1/messages', service({
        name: 'message',
        Model: Message,
        paginate: {
            default: 50
                // max: 50
        }
    }));

    // Get our initialize service to that we can bind hooks
    const messageService = app.service('/v1/messages');

    // Set up our before hooks
    messageService.before({
        all: [
            authenticationHooks.restrictToAuthenticated()
        ]
    });
};
