var logger = require("../logger");
var utils = require("../utils");

module.exports = function(app, config) {

    //public pages=============================================
    //root

    app.get('/', function(req, res) {

        res.render('lander.ejs');

    });

    app.get('/slack', function(req, res) {

        res.render('slack.ejs', {
            SLACK_CLIENT_ID: config.slack.SLACK_CLIENT_ID,
            SLACK_REDIRECT: config.slack.SLACK_REDIRECT
        });

    });

    app.get('/sample_confirmation', function(req, res) {

        var next_url = req.query["next-url"];

        res.render('sample-confirmation', {
            next_url: next_url
        });

    });

    app.get('/success_payment/:service/:id', function(req, res) {

        var id = req.params.id;

        var service = req.params.service;

        app.service("/v1/users").get(id).then(function(user) {

            var convo_id = user.convo_id;

            var convo = app.mermaid.findConvo(convo_id, service);

            if (convo) {
                convo.response = "Have Successfully added credit card.";
                convo.stop("completed");
            }

            res.send("ok");

        }).catch(function(err) {
            logger.error("Error retreiving user data from user service : %s", err);

            res.status(404).send("Error retreiving user data from user service.");
        })
    });




    app.post('/send-message', function(req, res) {

        var data = req.body;

        utils.createMessageFromData.call(app, data).then(() => {
            res.send(200);
        }).catch((err) => {
            logger.error(err);
            res.send(400);
        })

    });


}
