var _ = require("lodash"),
    logger = require("../logger"),
    Utils = require("../utils");

var unwrapFromList = function(cb) {
    return function(data) {
        cb(null, data ? data.toObject() : null);
    };
};

module.exports = function(app) {

    var storage = {
        teams: {
            get: function(id, cb) {
                app.service("/v1/teams").get(id).then(unwrapFromList(cb));
            },
            save: function(data, cb) {
                app.service("/v1/teams").update(data.id, data, {
                    upsert: true,
                    new: true
                }, cb)
            },
            all: function(cb) {
                app.service("/v1/teams").find().then(cb)
            }
        },
        users: {
            get: function(query, cb) {

                if (typeof query === "string") {
                    query = {
                        id: query
                    }
                }

                app.service("/v1/users").find(query).exec(unwrapFromList(cb));
            },
            save: function(data, cb) {

                if (data.scopes && !data.first_name) {

                    var adapter = require("./adapters/slack")(app);

                    adapter.users.addProfileData(data).then((data) => {

                        app.service("/v1/users").update(data.id, data, {
                            upsert: true,
                            new: true
                        }).then((user) => {

                            return cb && cb(null, user);

                        }).catch((err) => cb(err));

                    }).catch((err) => cb(err));

                } else {

                    app.service("/v1/users").update(data.id, data, {
                        upsert: true,
                        new: true
                    }).then((user) => {

                        return cb && cb(null, user);

                    }).catch((err) => {
                        logger.error("Error upading user in mongo adapter: %s", err);
                        return cb && cb(err);
                    });

                }

            },
            update: function(query, data, cb) {

                app.service("/v1/users").update(query.id, {
                    $set: data
                }).then(cb).catch((err) => logger.error(err));

            },
            all: function(cb) {
                app.service("/v1/users").find().then(cb).catch((err) => logger.error(err));
            }
        },
        channels: {
            get: function(id, cb) {
                app.service("/v1/channels").find({
                    id: id
                }).then(unwrapFromList(cb)).catch((err) => logger.error(err));
            },
            save: function(data, cb) {
                app.service("/v1/channels").update({
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }).then(cb).catch((err) => logger.error(err));
            },
            all: function(cb) {
                app.service("v1/channels").find().then(cb).catch((err) => logger.error(err));
            }
        }
    };

    return storage;

}
