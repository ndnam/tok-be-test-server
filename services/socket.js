const { Server } = require("socket.io");
const eventEmitter = require('./event');
const { getOrderBook } = require('./order_book');

const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
          origin: process.env.FRONT_END_URL
        }
      });

    io.on('connection', (socket) => {
        console.log('a user connected');
    });

    eventEmitter.on('OrderBookGenerated', async () => {
        io.emit('OrderBookGenerated', await getOrderBook());
    });
}

module.exports = { initSocketServer };
