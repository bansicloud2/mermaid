const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Channel = require('../../models/channel');
var hooks = require("feathers-hooks");
var _ = require("lodash");

module.exports = function() {
    const app = this;

    app.use('/v1/channel', service({
        name: 'channel',
        Model: Channel,
        paginate: {
            default: 100,
            max: 100
        },
        overwrite : false,
        id: "id"
    }));

};
