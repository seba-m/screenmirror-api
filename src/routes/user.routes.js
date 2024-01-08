const { profile, stream, updateProfile, updateStream, deleteAccount, updateStreamKey, updateContact, updateColor, getColor } = require('../controller/user.controller');
const { verifyToken } = require('../middlewares/jwt.middleware');

const { query, body, param } = require('express-validator');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/api/user/profile', verifyToken, profile);

    app.get('/api/user/stream', [verifyToken], stream);

    app.post('/api/user/profile/settings', [verifyToken], updateProfile);

    app.post('/api/user/profile/stream', [verifyToken], updateStream);

    app.post('/api/user/profile/contact', [
        verifyToken,
        body('password')
            .isLength({ min: 6, max: 40 })
            .withMessage('Password must be between 6 and 40 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        body('newPassword')
            .isLength({ min: 6, max: 40 })
            .withMessage('Password must be between 6 and 40 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        
    ], updateContact);

    app.post('/api/user/profile/key', [verifyToken], updateStreamKey);

    app.delete('/api/user/profile/delete', [verifyToken], deleteAccount);
};