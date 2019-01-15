const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/auth');

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

// Route defenition
app.use('/auth', authRoutes);

// General app error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

mongoose.connect(
    'mongodb+srv://dannyjanssen:x0uriKnjaqe6ELV2@cluster0-9p6kc.mongodb.net/medical_wearable?retryWrites=true')
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));