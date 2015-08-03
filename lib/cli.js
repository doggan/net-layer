#! /usr/bin/env node

var program = require('commander'),
    packageJSON = require('../package.json');

program
    .version(packageJSON.version)
    .option('-p, --port <n>', 'port number', parseInt);

program.parse(process.argv);

var net_layer = require('./index.js');
net_layer.startServer({
    port: program.port
});
