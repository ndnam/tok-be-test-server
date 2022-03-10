const axios = require('axios');
const chance = require('chance').Chance();
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

const generateBidOrders = price => {
    const orders = []; 
    let totalValue = 0;
    for (let i = 0; i < 100; i++) {
        size = generateSize();
        totalValue += price * size;
        if (totalValue > 5) break;

        orders.push([price, size]);
        price = generatePrice(price, 'bid');
    }

    return orders;
};

const generateAskOrders = price => {
    const orders = [];
    let totalSize = 0;
    for (let i = 0; i < 100; i++) {
        size = generateSize();
        totalSize += size;
        if (totalSize > 150) break;

        orders.push([price, size]);
        price = generatePrice(price, 'ask');
    }

    return orders;
};


/**
 * Generate a random order book base on bid and ask prices from Binance
 */
const generateOrderBook = async () => {
    const { data: { bidPrice, askPrice } } = await axios.get('https://api.binance.com/api/v3/ticker/bookTicker?symbol=ETHBTC');
    orderBook = {
        bids: generateBidOrders(parseFloat(bidPrice)),
        asks: generateAskOrders(parseFloat(askPrice)),
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
    startOrderBookGeneration,
};
