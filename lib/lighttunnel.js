#!/usr/bin/env node

var localtunnel = require('localtunnel');
var logger = require("../logger");

var tunnel;

module.exports = {

    start: function(port) {

        tunnel = localtunnel(port, {
            subdomain: "sage"
        }, function(err, lt) {
            if (err) {
                logger.error("Error establishing tunnel: " + err);
            }

            logger.info("Local Tunnel up at: " + lt.url);

        });

        tunnel.on('close', function() {

            logger.info("Tunnel has closed");

        });

        tunnel.on("error", function(err) {
            logger.error("Error: " + err);
        })

    }

}
