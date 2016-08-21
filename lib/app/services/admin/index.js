const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Admin = require('../../models/admin');
var hooks = require("feathers-hooks");
var _ = require("lodash");
const authenticationHooks = require('feathers-authentication').hooks;

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

    // Set up our hooks

    adminService.before({
        all: [
            authenticationHooks.restrictToAuthenticated()
        ],
        create: authenticationHooks.hashPassword()
    });

};
