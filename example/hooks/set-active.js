var logger = require("../../lib/logger");

var setActive = function(done) {

    this.app.service("/v1/users").get(this.context.user.id).then((user) => {

        this.app.service("/v1/users").update(this.context.user.id, {
            "session.active": true
        }).then((user) => {

            logger.info("Set user %s to active.", user.id);

            done();

        }).catch((err) => {

            logger.debug(err);

        })



    }).catch(function(err) {
        logger.debug(err);
    })

};

module.exports = setActive;
