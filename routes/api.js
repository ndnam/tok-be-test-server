const express = require('express');
const { getOrderBook } = require('../services/order_book');

const router = express.Router();
router.get('/order-book', async (req, res, next) => {
    res.json(await getOrderBook());
});

module.exports = router;
