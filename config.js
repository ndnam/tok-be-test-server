module.exports = {
    corsOptions: {
        origin: function (origin, callback) {
            if (typeof origin === 'undefined' || origin == process.env.FRONT_END_URL) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }
};
