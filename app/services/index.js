const message = require('./message');
const user = require('./user');
const team = require('./team');
const channel = require('./channel');
const admin = require('./admin');
const group = require('./group');
const group_messages = require('./group-message');


module.exports = function() {

    const app = this;

    app.configure(user);
    app.configure(message);
    app.configure(admin);
    app.configure(group);
    app.configure(group_messages);
    app.configure(team);
    app.configure(channel);

};
