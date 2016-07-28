var Team = require("../../../models/team"),
    User = require("../../../models/user"),
    Channel = require("../../../models/channel"),
    _ = require("lodash"),
    logger = require("../../../logger"),
    Utils = require("../utils");

var unwrapFromList = function(cb) {
    return function(err, data) {
        if (err) return cb(err);
        cb(null, data ? data.toObject() : null);
    };
};

var users = {};

module.exports = function(app) {

    var storage = {
        teams: {
            get: function(id, cb) {
                Team.findOne({
                    id: id
                }).exec(unwrapFromList(cb));
            },
            save: function(data, cb) {
                Team.update({
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb);
            },
            all: function(cb) {
                Team.find({}).lean().exec(cb);
            }
        },
        users: {
            get: function(query, cb) {

                if (typeof query === "string") {
                    query = {
                        id: query
                    }
                }

                User.findOne(query).exec(unwrapFromList(cb));
            },
            save: function(data, cb) {

                if (data.scopes && !data.first_name) {

                    var adapter = require("./adapters/slack")(app);

                    adapter.users.addProfileData(data).then((data) => {

                        User.update({
                            id: data.id
                        }, data, {
                            upsert: true,
                            new: true
                        }, function(err, user) {

                            if (err) {
                                logger.error("Error upading user in mongo adapter: %s", err);
                            }

                            return cb && cb(null, user);

                        });

                    }).catch((err) => cb(err));

                } else {

                    User.update({
                        id: data.id
                    }, data, {
                        upsert: true,
                        new: true
                    }, function(err, user) {

                        if (err) {
                            logger.error("Error upading user in mongo adapter: %s", err);
                        }

                        return cb && cb(null, user);

                    });

                }

            },
            update: function(query, data, cb) {

                User.update(query, {
                    $set: data
                }, cb);

            },
            all: function(cb) {
                User.find({}).lean().exec(cb);
            }
        },
        channels: {
            get: function(id, cb) {
                Channel.findOne({
                    id: id
                }).exec(unwrapFromList(cb));
            },
            save: function(data, cb) {
                Channel.update({
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb);
            },
            all: function(cb) {
                Channel.find({}).lean().exec(cb);
            }
        }
    };

    return storage;

}
