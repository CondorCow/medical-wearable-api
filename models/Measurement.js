const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSchema = new Schema({
    type: [{
        type: Schema.Types.ObjectId, ref: 'MeasurementType'
    }],
    values: [{
        type: Schema.Types.ObjectId, ref: 'MeasurementSectionValue'
    }],
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