var express = require('express'),
    path = require('path');

var app = express();

var server = require('http').createServer(app).listen(8080);
var io = require('socket.io').listen(server);

// var objectId = 0;

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    console.log('client connected: ' + socket.id + ' (total: ' + findClientsSocket().length + ')');

    onConnection(socket);

    socket.on('disconnect', function() {
        var clients = findClientsSocket();
        console.log('client disconnected: ' + socket.id + ' (total: ' + clients.length + ')');

        // Alert other players.
        socket.broadcast.emit('playerLeft', {
            sessionId: socket.id
        });
    });

    // socket.on('createObject', function() {
    //     console.log('createObject received...');
    //
    //     socket.emit('createObject', {
    //         id: objectId++
    //     });
    // });

    // Session:
    socket.on('broadcastToOthers', function(data) {
        socket.broadcast.emit('broadcastToOthers', data);
    });
    // socket.on('broadcastToAll', function(data) {
    // });
    socket.on('sendTo', function(data) {
        var socketId = data.sessionId;
        io.to(socketId).emit('sendTo', data);
    });

    // Object:
    socket.on('broadcastToOthers_object', function(data) {
        socket.broadcast.emit('broadcastToOthers_object', data);
    });
    // socket.on('broadcastToAll_object', function(data) {
    // });
    socket.on('sendTo_object', function(data) {
        var socketId = data.sessionId;
        io.to(socketId).emit('sendTo_object', data);
    });
});

function onConnection(socket) {
    var clients = findClientsSocket();

    // Alert other players.
    socket.broadcast.emit('playerJoined', {
        sessionId: socket.id
    });

    // Alert this player of the other players already existing.
    var otherClientIDs = [];
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id !== socket.id) {
            otherClientIDs.push(clients[i].id);
        }
    }
    for (i = 0; i < otherClientIDs.length; i++) {
        socket.emit('playerJoined', {
            sessionId: otherClientIDs[i]
        });
    }
}

function findClientsSocket(roomId, namespace) {
    var res = [],
        ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}

console.log("Express server listening on port 8080");

/*
 // send to current request socket client
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.sockets.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

  // sending to all clients in 'game' room(channel), include sender
 io.sockets.in('game').emit('message', 'cool game');

 // sending to individual socketid
 io.sockets.socket(socketid).emit('message', 'for your eyes only');
 */
