const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Team = require('../../models/team');
var hooks = require("feathers-hooks");
var _ = require("lodash");

module.exports = function() {
    const app = this;

    app.use('/v1/teams', service({
        name: 'team',
        Model: Team,
        paginate: {
            default: 100,
            max: 100
        },
        overwrite : false
    }));

};
