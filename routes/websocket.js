const express = require('express');
const { WebSocket } = require("ws");
const eventEmitter = require('../services/event');
const { getOrderBook } = require('../services/order_book');
const router = express.Router();

router.ws('/depth', (ws, req) => {
    console.log('Client connect from ' + req.socket.remoteAddress);

    // Keep-alive protocol. Ping client every 30 minute.
    let isAlive = true;
    const pingInterval = setInterval(() => {
        if (isAlive === false) {
            ws.terminate();
        }
        isAlive = false;
        ws.ping();
    }, 180000);
    ws.on('pong', () => {
        isAlive = true;
    });
    ws.on('close', () => {
        clearInterval(pingInterval);
    });

    eventEmitter.on('OrderBookGenerated', async () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(await getOrderBook()));
        }
    });

});

module.exports = router;
