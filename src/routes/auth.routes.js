const { body, param } = require('express-validator');

const { checkDuplicate, signin, signup, recoverPassword, activateAccount, resetPassword } = require('../controller/auth.controller');

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        '/api/auth/signup', 
        [
            body('username')
                .isLength({ min: 3, max: 20 })
                .withMessage('Username must be between 3 and 20 characters'),
            body('email')
                .isEmail()
                .normalizeEmail({
                    gmail_remove_dots: false
                }),
            body('password')
                .isLength({ min: 6, max: 40 })
                .withMessage('Password must be between 6 and 40 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
                .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
            body('birthDate').isDate(),
        ],
        checkDuplicate, 
        signup
    );

    app.post(
        '/api/auth/signin',
        [
            body('password')
                .isLength({ min: 6, max: 40 })
                .withMessage('Invalid password.')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
                .withMessage('Invalid password.')
        ],
        signin
    );

    app.post(
        '/api/auth/recover',
        [
            body('email')
                .isEmail()
                .normalizeEmail({
                    gmail_remove_dots: false
                }),
        ],
        recoverPassword
    );

    app.get('/api/auth/reset',
        [
            body('key')
                .matches(/([\da-fA-F])*/)
                .withMessage('Invalid key.')
        ],
        resetPassword
    );

    app.get('/api/auth/activate/:key',
        [
            param('key')
                .matches(/([\da-fA-F])*/)
                .withMessage('Invalid key.')
        ], 
        activateAccount
    );
};