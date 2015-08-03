#! /usr/bin/env node

var express = require('express'),
    program = require('commander'),
    packageJSON = require('../package.json');

var port = 8080;

function parseCLI() {
    program
        .version(packageJSON.version)
        .option('-p, --port <n>', 'port number', parseInt);

    program.parse(process.argv);

    if (program.port) {
        port = program.port;
    }
}

function startServer() {
    var app = express();
    var server = require('http').createServer(app).listen(port);
    var io = require('socket.io').listen(server);

    require('./sockets')(io);

    console.log('Server listening on port: ' + port);
}

parseCLI();
startServer();
