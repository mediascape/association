#!/usr/bin/env node

"use strict";

/**
 * MediaScape SharedState - SocketServer.js
 * Enable the Socket connection
 *
 * @author Andreas Bosl <bosl@irt.de>
 * @copyright 2014 Institut für Rundfunktechnik GmbH, All rights reserved.
 */

function SocketServer(server) {
    var that;

    var EventEmitter = require('events').EventEmitter;

    var config = require('../config');

    var log4js = require('log4js');
    log4js.configure(config.logConfig);
    var logger = log4js.getLogger('SocketServer');

    var io = require('socket.io')(server);

    var nameSpaces = {};

    function init() {
        io.on('connection', function (socket) {
            socket.on('getMapping', function (request) {
                that.emit('getMapping', request, function (response) {
                    socket.emit('mapping', response);
                });
            });
        });

    }

    function createNameSpace(path) {
        var nsp = io.of('/' + path);

        var clients = {};

        logger.info('created nsp with', path);


        nsp.on('connection', function (socket) {


            socket.on('join', onJoin);
            socket.on('disconnect', onDisconnect);
            socket.on('changePresence', onChangePresence);
            socket.on('getState', onGetState);
            socket.on('changeState', onChangeState);
            socket.on('getInitState', onGetInitState);


            function onGetInitState(data) {
                if (clients[socket.id]) {
                    that.emit('getState', path, data, function (datagram) {
                        sendPrivate('initState', datagram);
                    });
                } else {
                    sendPrivate('ssError', 'not logged in');
                }
            };

            function onJoin(data) {
                logger.debug('somebody want to join', path, 'with', data);
                if ((data.token) && (data.agentID)) {
                    that.emit('join', path, data, function (allowed) {
                        if (allowed) {
                            socket.MSagentID = data.agentID
                            socket.MSpresence = 'online';
                            clients[socket.id] = socket;
                            sendPrivate('joined', data);
                            doStatus();
                            doUpdateStatus(socket);
                        } else {
                            sendPrivate('ssError', 'not allowed to join');
                        }
                    });
                } else {
                    sendPrivate('ssError', 'need to provide token and agentID');
                }

            };

            function onDisconnect() {
                if (clients[socket.id]) {
                    delete clients[socket.id];
                    doUpdateStatus(socket.MSagentID);
                }
            };


            function onChangePresence(data) {
                if (clients[socket.id]) {
                    if (data.agentID == socket.MSagentID) {
                        socket.MSpresence = data.presence;
                        doUpdateStatus(socket);
                    } else {
                        sendPrivate('ssError', 'wrong AgentID??');
                    }
                } else {
                    sendPrivate('ssError', 'not logged in');
                }
            };


            function onGetState(data) {
                if (clients[socket.id]) {
                    doGetState(data);
                } else {
                    sendPrivate('ssError', 'not logged in');
                }
            };


            function onChangeState(data) {
                if (clients[socket.id]) {
                    logger.debug(path, 'received', 'onChange', data);
                    doChangeState(data);
                } else {
                    sendPrivate('ssError', 'not logged in');
                }
            };

            function doStatus() {
                var clientKeys = Object.keys(clients);

                var statusInfo = {
                    clients: clientKeys.length,
                    presence: []
                }
                for (var i = 0; i < clientKeys.length; i++) {
                    var clientstatus = {
                        key: clients[clientKeys[i]].MSagentID,
                        value: clients[clientKeys[i]].MSpresence
                    };
                    statusInfo.presence.push(clientstatus);
                }

                sendPrivate('status', statusInfo);
            };

            function doUpdateStatus(theSocket) {

                var clientKeys = Object.keys(clients);

                var statusInfo = {
                    clients: clientKeys.length,
                };

                if (typeof theSocket == 'string') {
                    statusInfo.presence = [{
                        key: theSocket,
                        value: 'disconnected'
                    }];
                } else {
                    statusInfo.presence = [{
                        key: theSocket.MSagentID,
                        value: theSocket.MSpresence
                    }];
                }

                sendAll('status', statusInfo);
            };

            function doGetState(data) {
                that.emit('getState', path, data, function (datagram) {
                    sendPrivate('changeState', datagram);
                });
            };

            function doChangeState(data) {
                that.emit('changeState', path, data);
            };

            function sendPrivate(event, msg) {
                logger.debug(path, 'sending Private', event, msg);
                socket.emit(event, msg);
            };

            function sendAll(event, msg) {
                logger.debug(path, 'sending', event, msg);
                nsp.emit(event, msg);
            }

            nsp.sendALL = sendAll;
        });



        nameSpaces[path] = nsp;
    };





    function createNSP(pathes) {
        if (Array.isArray(pathes)) {
            for (var i = 0, len = pathes.length; i < len; i++) {
                createNameSpace(pathes[i]);
            }
        } else {
            createNameSpace(pathes);
        }
    };



    function changeState(path, data) {
        nameSpaces[path].sendALL('changeState', data);
    };


    that = {
        changeState: changeState,
        createNSP: createNSP

    };

    init();

    that.__proto__ = EventEmitter.prototype;

    return that;
}

module.exports = SocketServer;
