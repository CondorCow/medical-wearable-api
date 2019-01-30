const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSectionValueSchema = mongoose.model('MeasurementSectionValue').schema;

const measurementSchema = new Schema({
    measurementType: {type: Schema.Types.ObjectId, ref: 'MeasurementType'},
    values: [measurementSectionValueSchema],
    recordedBy: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    client: {
        type: Schema.Types.ObjectId, ref: 'Client'
    },
    recordedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Measurement', measurementSchema);