const express = require('express');
const router = express.Router();
const {body} = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

router.post('/signup', [
    body('email').isEmail()
        .withMessage('Voer een geldig e-mailadres in.')
        .custom((value, {req}) => {
            return User.findOne({email: value}).then(userDoc => {
                if (userDoc) {
                    // return Promise.reject('Email address already exists.');
                    return Promise.reject('Er bestaat al een account met dit e-mailadres.');
                }
            })
        }).normalizeEmail()
], authController.signup);

router.post('/login',[
    body('email').isEmail().withMessage('Voer een geldig e-mailadres in.')
],authController.login);

module.exports = router;