const express = require('express');
const router = express.Router();
const {body} = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

const EMAIL_REGEX = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

router.post('/signup', [
    body('email').isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            return User.findOne({email: value}).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exists.');
                }
            })
        }).normalizeEmail()
], authController.signup);

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email.')
],authController.login);

module.exports = router;