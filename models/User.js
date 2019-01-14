const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encrypt = require('mongoose-encryption');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    }
});

userSchema.plugin(encrypt, {secret: 'secret', excludeFromEncryption: ['email']});

module.exports = mongoose.model('User', userSchema);