var _ = require("lodash"),
    logger = require("../logger"),
    Utils = require("../utils");

module.exports = function(app) {

    var storage = {
        teams: {
            get: function(id, cb) {
                app.service("/v1/teams").get(id).then((team) => cb(null, team)).catch((e) => cb(e));
            },
            save: function(data, cb) {
                app.service("/v1/teams").update(data.id, data, {
                    mongoose: {
                        upsert: true,
                        new: true
                    }
                }).then((team) => cb(null, team.id)).catch((e) => logger.error(e))
            },
            all: function(cb) {
                app.service("/v1/teams").find().then((teams) => cb(null, teams.data)).catch((e) => cb(e));
            }
        },
        users: {
            get: function(id, cb) {

                app.service("/v1/users").get(id).then((user) => cb(null, user)).catch((e) => cb(e));
            },
            save: function(data, cb) {

                if (data.scopes && !data.first_name) {

                    var adapter = require("./adapters/slack")(app);

                    adapter.users.addProfileData(data).then((data) => {

                        app.service("/v1/users").update(data.id, data, {
                            mongoose: {
                                upsert: true,
                                new: true
                            }
                        }).then((user) => {

                            return cb && cb(null, user.id);

                        }).catch((err) => cb(err));

                    }).catch((err) => cb(err));

                } else {

                    app.service("/v1/users").update(data.id, data, {
                        mongoose: {
                            upsert: true,
                            new: true
                        }
                    }).then((user) => {

                        return cb && cb(null, user.id);

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
                app.service("/v1/users").find().then((users) => cb(null, users.data)).catch((err) => cb(err));
            }
        },
        channels: {
            get: function(id, cb) {
                app.service("/v1/channels").get(id).then((channel) => cb(null, channel)).catch((err) => cb(err));
            },
            save: function(data, cb) {
                app.service("/v1/channels").update({
                    id: data.id
                }, data, {
                    mongoose: {
                        upsert: true,
                        new: true
                    }
                }).then((channel) => {
                    cb(null, channel.id);
                }).catch((err) => {
                    logger.error(err)
                    return cb(err);
                });
            },
            all: function(cb) {
                app.service("/v1/channels").find().then((channels) => {
                    return cb(null, channels.data);
                }).catch((err) => {
                    logger.error(err)
                    return cb(err)
                });
            }
        }
    };

    return storage;

}
