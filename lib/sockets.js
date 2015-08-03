var _ = require('lodash');

module.exports = function(io) {
    io.on('connection', function(socket) {
        onConnect(socket);

        socket.on('disconnect', function() {
            return onDisconnect(socket);
        });

        /**
         * Forward the packet to all connected clients.
         */
        socket.on('send_all', function(data) {
            io.emit('rpc', data);
        });
        /**
         * Forward the packet to all connected clients EXCEPT the sender.
         */
        socket.on('broadcast', function(data) {
            socket.broadcast.emit('rpc', data);
        });
        /**
         * Forward the packet to the specified client.
         */
        socket.on('send', function(data) {
            var socketId = data.socketId;
            if (socketId) {
                io.to(socketId).emit('rpc', data);
            }
        });
    });

    function onConnect(socket) {
        var clients = getConnectedClientSockets();
        console.log('client connected: ' + socket.id + ' (total: ' + clients.length + ')');

        // Alert other clients.
        socket.broadcast.emit('client_connected', {
            socketId: socket.id
        });

        // Alert this client of the other clients already existing.
        _.forEach(clients, function(client) {
            if (client.id !== socket.id) {
                socket.emit('client_connected', {
                    socketId: client.id
                });
            }
        });
    }

    function onDisconnect(socket) {
        var clients = getConnectedClientSockets();
        console.log('client disconnected: ' + socket.id + ' (total: ' + clients.length + ')');

        // Alert other clients.
        socket.broadcast.emit('client_disconnected', {
            socketId: socket.id
        });
    }

    /**
     * Returns a list of the connected clients sockets.
     * See: http://stackoverflow.com/questions/6563885/socket-io-how-do-i-get-a-list-of-connected-sockets-clients
     */
    function getConnectedClientSockets(roomId, namespace) {
        var res = [],
            ns = io.of(namespace || "/"); // the default namespace is "/"

        if (ns) {
            for (var id in ns.connected) {
                if (roomId) {
                    var index = ns.connected[id].rooms.indexOf(roomId);
                    if (index !== -1) {
                        res.push(ns.connected[id]);
                    }
                } else {
                    res.push(ns.connected[id]);
                }
            }
        }
        return res;
    }
};
