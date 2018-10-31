// A simple server-side script that serves a JSON object.
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3000 });

// Test data.
var generator = function(){
    var fruitBasket = [
        'banana',
        'apple',
        'lemon',
        'pear',
        'orange',
        'peach'
    ];

    var randPick = fruitBasket[Math.floor(Math.random() * fruitBasket.length)];
    return randPick;
};

// Test data.
var ticker = {
    'fruit' : null,
    'feedback' : null,
};

// Container for the protocol.
var data_container = {
    'message' : null,
    'data' : null,
};

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        wss.clients.forEach(function(client) {
            // Debug
            console.log('[server:onMessage] received request:', message);

            // Update carrier.
            data_container['data']  = {
                'fruit' : generator(),
                'feedback' : message,
            };
            data_container['message'] = message;

            // Prepare for transmission.
            var transmission = JSON.stringify(data_container);

            // Send the transmission.
            console.log('[server:onMessage] Sending:', transmission);
            client.send(transmission);
        });
    });

    // Update carrier.
    data_container['message'] = 'Welcome to our data stream.';
    data_container['data'] = null;

    // Prepare for transmission.
    var transmission = JSON.stringify(data_container);
    console.log('[server:onConnection] Sending:', transmission);

    // Send carrier.
    ws.send(transmission);
});
