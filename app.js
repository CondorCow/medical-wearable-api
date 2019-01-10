const express = require('express');
const bodyParser = require('body-parser');


const app = express();

// JSON body parser
app.use(bodyParser.json());

// Set headers to allow incoming request from other domains
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// TODO: Define routes

// TODO: Set relations via Sequelize models

// General app error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// TODO: Sequelize.sync "({force: true})" => then app.listen(3000)