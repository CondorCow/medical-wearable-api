const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSectionSchema = mongoose.model('MeasurementSection').schema;

const measurementTypeSchema = new Schema({
    identifier: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sections:[measurementSectionSchema]
});

module.exports = mongoose.model('MeasurementType', measurementTypeSchema);