const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { startOrderBookGeneration } = require('./services/order_book');
require('dotenv').config();

const app = express();
const expressWs = require('express-ws')(app);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', require('./routes/api'));
app.use('/ws', require('./routes/websocket'));

app.use((err, req, res, next) => {
    res.status(500).json({error: err.message});
});

app.listen(process.env.PORT || '3000');

startOrderBookGeneration();
