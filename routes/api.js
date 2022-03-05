const express = require('express');
const { getOrderBook } = require('../services/order_book');
const router = express.Router();

router.get('/order-book', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await getOrderBook()));
});

module.exports = router;
