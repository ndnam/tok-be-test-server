const axios = require('axios');
const chance = require('chance').Chance();
const { setImmediate: setImmediatePromise } = require('timers/promises');
const eventEmitter = require('./event');


let orderBook;

/**
 * Generate next price in the list
 */
const generatePrice = (lastPrice, type = 'bid') => {
    const diff = (type == 'bid' ? -1 : 1) * Math.ceil(Math.abs(chance.normal({ dev: 10 })) + 1);
    return Math.round(lastPrice * 100000000 + diff) / 100000000;
};

const generateSize = () => Math.floor(Math.random() * 1000000000) / 100000000;

const generateBidOrders = async price => {
    let size = generateSize();
    let totalValue = price * size;
    const orders = [[price, size]];

    for (let i = 0; i < 100; i++) {
        // Partition the execution to not block the event loop
        await setImmediatePromise();

        price = generatePrice(price, 'bid');
        size = generateSize();
        totalValue += price * size;
        if (totalValue > 5) {
            break;
        }
        orders.push([price, size]);
    }

    return orders;
};

const generateAskOrders = async price => {
    let size = generateSize();
    let totalSize = size;
    const orders = [[price, size]];

    for (let i = 0; i < 100; i++) {
        // Partition the function execution
        await setImmediatePromise();

        size = generateSize();
        totalSize += size;
        if (totalSize > 150) {
            break;
        }
        price = generatePrice(price, 'ask');
        orders.push([price, size]);
    }

    return orders;
};

/**
 * Generate a random order book
 */
const generateOrderBook = async () => {
    const { data: { bidPrice, askPrice } } = await axios.get('https://api.binance.com/api/v3/ticker/bookTicker?symbol=ETHBTC');
    orderBook = {
        bids: await generateBidOrders(parseFloat(bidPrice)),
        asks: await generateAskOrders(parseFloat(askPrice)),
    };

    return orderBook;
};

const getOrderBook = async () => {
    if (!orderBook) {
        await generateOrderBook();
    }

    return orderBook;
};

const startOrderBookGeneration = () => {
    setInterval(async () => {
        await generateOrderBook();
        eventEmitter.emit('OrderBookGenerated');
        console.log('new order book generated')
    }, 5000);
};

module.exports = {
    getOrderBook,
    generateOrderBook,
    startOrderBookGeneration,
};
