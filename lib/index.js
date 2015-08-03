#! /usr/bin/env node

var express = require('express');

var port = 8080;

function doStartServer() {
    var app = express();
    var server = require('http').createServer(app).listen(port);
    var io = require('socket.io').listen(server);

    require('./sockets')(io);

    console.log('Server listening on port: ' + port);
}

module.exports = {
    startServer: function(options) {
        options = options || {};
        port = typeof options.port !== 'undefined' ? options.port : port;

        doStartServer();
    }
};
