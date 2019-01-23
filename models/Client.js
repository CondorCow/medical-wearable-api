const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoIncrement = require('mongoose-auto-increment');
const encrypt = require('mongoose-encryption');

const clientSchema = new Schema({
    clientNumber: {
        type: Number,
        autoIncrement: true,
        unique: true,
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

// Auto increment clientNumber
autoIncrement.initialize(mongoose.connection);
clientSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'clientNumber', startAt: 1000});

// clientSchema.plugin(encrypt, {secret: 'secret', excludeFromEncryption: ['clientNumber']});

module.exports = mongoose.model('Client', clientSchema);