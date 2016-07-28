var logger = require("../../../../../logger");

var markCompleted = function(done) {

    this.app.service("/v1/users").update(this.context.user.id, {
        $addToSet: {
            "session.completed-stages": this.context.uri
        }
    }).then((user) => {

        done();

    }).catch(function(err) {
        logger.debug(err);
    })

};

module.exports = markCompleted;
