const express = require('express');
const { WebSocket } = require("ws");
const eventEmitter = require('../services/event');
const { getOrderBook } = require('../services/order_book');
const router = express.Router();

router.ws('/depth', (ws, req) => {
    console.log('Client connect from ' + req.socket.remoteAddress);

    eventEmitter.on('OrderBookGenerated', async () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(await getOrderBook()));
        }
    });

});

module.exports = router;
