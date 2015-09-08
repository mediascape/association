#!/usr/bin/env node

/**
 * MediaScape SharedState - app.js
 * Main startpoint
 *
 * @author Andreas Bosl <bosl@irt.de>
 * @copyright 2014 Institut für Rundfunktechnik GmbH, All rights reserved.
 */

var config = require('./config');

var log4js = require('log4js');
log4js.configure(config.logConfig);

var logger = log4js.getLogger('MediaScape');

setTimeout(function () {
	//var core = require('./SharedCore')();
	var core = require('./lib/core')();
}, 1000);

process.on('SIGINT', function () {
	logger.info('Got a SIGINIT - terminating');
	process.exit(0);
});
