var logger = require("../../../logger");

var markCompleted = function(done) {

    var text = "User has requested for assistance on the platform.";

    this.app.mermaid.methods.messageTeam(text);

    done();

};

module.exports = markCompleted;
