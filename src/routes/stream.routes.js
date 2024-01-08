const { viewStreamer } = require("../controller/stream.controller");

const { param } = require('express-validator');

module.exports = function (app) {
    app.get('/api/stream/view/:streamName',
        [
            param('streamName')
                .not().isEmpty()
                .withMessage('Stream name is required')
                .escape()
                .trim()
                .isLength({ min: 3, max: 20 })
                .withMessage('Stream name must be between 3 and 20 characters long')
                .matches(/^[a-zA-Z0-9]+$/)
                .withMessage('Invalid Streamer name')
        ]
        , viewStreamer);
};
