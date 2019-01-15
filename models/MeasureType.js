const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    sections: [{
        type: Schema.Types.ObjectId, ref: 'MeasurementSection'
    }]
});

module.exports = mongoose.model('MeasurementType', measurementTypeSchema);