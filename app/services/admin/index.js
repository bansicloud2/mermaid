const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Admin = require('../../models/admin');
var hooks = require("feathers-hooks");
var _ = require("lodash");
var authentication = require('feathers-authentication');

module.exports = function() {
    const app = this;

    app.use('/v1/admins', service({
        name: 'admin',
        Model: Admin,
        paginate: {
            default: 100,
            max: 100
        }
    }));

    // Get our initialize service to that we can bind hooks
    const adminService = app.service('/v1/admins');

    // Set up our after hooks

    adminService.before({
        create: authentication.hooks.hashPassword()
    });

};
