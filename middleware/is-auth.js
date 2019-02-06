const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    // Token would be 'Bearer {token}' so split on space and extract the token
    const token = authHeader.split(' ')[1];
    console.log(token);
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'NobodyShouldEverKnowThisSecret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    // It decoded, but couldn't verify the token
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    // TODO: Get user from db
    User.findOne({_id: decodedToken.userId}).then(result => {
        if (!result) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        } else {
            req.user = result;
        }
    });
    next();
};