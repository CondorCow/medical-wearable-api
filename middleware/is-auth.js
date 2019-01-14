const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    // Token would be 'Bearer {token}' so split on space and extract the token
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(jwt, 'NobodyShouldEverKnowThisSecret');
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

    req.userId = decodedToken.userId;
    next();
};