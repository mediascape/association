#!/usr/bin/env node

"use strict";
/**
 * MediaScape SharedState - express.js
 * Simple Express Server
 *
 * @author Andreas Bosl <bosl@irt.de>
 * @copyright 2014 Institut für Rundfunktechnik GmbH, All rights reserved.
 */

function ExpressServer() {
    var that;

    var config = require('../config');

    var log4js = require('log4js');
    log4js.configure(config.logConfig);
    var logger = log4js.getLogger('ExpressServer');

    // Setup express server
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);

	app.configure(function () {
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
	});

	var mongoose     = require("mongoose");

	var Requests     = require('../dbConnectors/requested');
	var Associated   = require('../dbConnectors/associated');

	var routes = require('../routes/api')(app,mongoose);

	// Routing
	app.use(express.static(__dirname + config.express.filePath));

    server.listen(config.express.port, function () {
        logger.debug('Webserver listening at port %d', config.express.port);
    });

	


    function getServer() {
        return server;
    };

    that = {
        getServer: getServer
    };

    return that;
}

module.exports = ExpressServer;
