#!/usr/bin/env node

var localtunnel = require('localtunnel');

var tunnel;

var start = function() {

    tunnel = localtunnel(3001, {
        subdomain: "sage"
    }, function(err, lt) {
        if (err) {
            console.error("Error establishing tunnel: " + err);
        }

        console.log("Local Tunnel up at: " + lt);

    });

    tunnel.on('close', function() {

        console.log("Tunnel has closed");

    });

    tunnel.on("error", function(err){
        console.log("Error: " + err);
    })

}

start();
