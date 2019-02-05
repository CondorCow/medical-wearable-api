const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator/check');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const {email, name, lastName, address, city, postalCode, telephone, password} = req.body;

        let hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            name,
            lastName,
            address,
            city,
            postalCode,
            telephone,
            password: hashedPw
        });
        let result = await user.save();
        res.status(201).json({message: 'User created.', userId: result._id});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const email = req.body.email;
        const password = req.body.password;

        let loadedUser = await User.findOne({email: email});
        if (!loadedUser) {
            const error = new Error('A user with this email is not found.');
            error.statusCode = 401;
            throw error;
        }

        let isEqual = await bcrypt.compare(password, loadedUser.password);
        if (!isEqual) {
            const error = new Error('Wrong password.');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 'NobodyShouldEverKnowThisSecret', {expiresIn: '24h'});

        res.status(200).json({token: token, userId: loadedUser._id.toString()})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.logout = (req, res, next) => {

};