const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSectionSchema = mongoose.model('MeasurementSection').schema;

const measurementSectionValueSchema = new Schema({
    section: measurementSectionSchema,
    value: {
        type: {},
        required: false
    }
});

module.exports = mongoose.model('MeasurementSectionValue', measurementSectionValueSchema);