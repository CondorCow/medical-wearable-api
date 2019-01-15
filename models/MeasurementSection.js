const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSectionSchema = new Schema({
    measurementType: {
        type: Schema.Types.ObjectId, ref: 'MeasurementType'
    },
    name: {type: String, required: true}
});

module.exports = mongoose.model('MeasurementSection', measurementSectionSchema);