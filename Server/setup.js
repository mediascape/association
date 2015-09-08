#!/usr/bin/env node

"use strict";
/**
 * MediaScape SharedState - setup.js
 * Setup the config file
 *
 * @author Andreas Bosl <bosl@irt.de>
 * @copyright 2014 Institut für Rundfunktechnik GmbH, All rights reserved.
 */

var config = require('./config.js');

var readline = require('readline');
var fs = require('fs');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Starting Setup...');

var q2 = function () {
    rl.question("URI to your mongodb [" + config.mongoose.uri + "]:", function (input) {
        if (input.length == 0) {
            q3();
        } else {
            config.mongoose.uri = input;
            q3();
        }
    });
};

var q3 = function () {
    rl.question("Port for the Express Server [" + config.express.port + "]:", function (input) {
        if (input.length == 0) {
            rl.close();
            save();
        } else {
            config.express.port = input;
            rl.close();
            save();
        }
    });
};

var save = function () {
    fs.writeFile('config.js', 'var config =' + JSON.stringify(config, null, "\t") + '\nmodule.exports = config;', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Saved to config.js!");
    });

};
q2();
