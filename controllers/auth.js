const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res, next) => {
    //TODO: Signup with validation => validationResult

    const email = req.body.email;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const address = req.body.address;
    const city = req.body.city;
    const postalCode = req.body.city;
    const telephone = req.body.telephone;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                name: name,
                lastName: lastName,
                address: address,
                city: city,
                postalCode: postalCode,
                telephone: telephone,
                password: hashedPw
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({message: 'User created.', userId: result._id});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email is not found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password.');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'NobodyShouldEverKnowThisSecret', {expiresIn: '1h'});

            console.log('username: ', loadedUser.name);
            console.log('city: ', loadedUser.city);
            res.status(200).json({token: token, userId: loadedUser._id.toString()})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.logout = (req, res, next) => {

};