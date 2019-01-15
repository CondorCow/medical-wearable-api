const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSectionValueSchema = new Schema({
    section: {
        type: Schema.Types.ObjectId,
        ref: 'MeasurementSection'
    },
    value: {
        type: {},
        required: false
    }
});

module.exports = mongoose.model('MeasurementSectionValue', measurementSectionValueSchema);