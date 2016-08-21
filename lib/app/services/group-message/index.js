const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const GroupMessage = require('../../models/group-message');
const utils = require("../../utils");
const authenticationHooks = require('feathers-authentication').hooks;

var User = require("../../models/user");

var logger = require("../../logger");

module.exports = function() {

    const app = this;

    var spread = function(options) {

        const messageService = app.service('/v1/messages');
        const groupService = app.service('/v1/groups');

        return function(hook) {

            groupService.get(hook.data.group_id).then((group) => {

                delete hook.data["group_id"]

                group.users.forEach((user) => {

                    var data = Object.assign({}, hook.data, {
                        user_id: user.id,
                        note: "Sent as a group message"
                    });

                    utils.createMessageFromData.call(app, data).then(() => {
                        logger.info("Group message for user %s", user.id);
                    }).catch((err) => {
                        logger.error(err);
                    })

                })

            });
        }

    };

    app.use('/v1/group-messages', service({
        name: 'group-message',
        Model: GroupMessage,
        paginate: {
            default: 50
        }
    }));

    // Get our initialize service to that we can bind hooks
    const groupMessageService = app.service('/v1/group-messages');

    groupMessageService.before({
        all: [
            authenticationHooks.restrictToAuthenticated()
        ]
    });

    // Set up our before hooks
    groupMessageService.after({
        create: [spread()]
    });
};
