const MeasurementType = require('../models/MeasurementType');
const MeasurementSection = require('../models/MeasurementSection');

exports.createMeasurementType = (req, res, next) => {
    const title = req.body.title;
    const sections = req.body.sections.map(s => {
        return MeasurementSection.findOne({name: s.name})
            .then(result => {
                if (!result) {
                    console.log('Created');
                    return new MeasurementSection({...s}).save();
                } else {
                    // console.log(s);
                    return s;
                }
            });
    });

    Promise.all(sections).then(sections => {
        const measurementType = new MeasurementType({
            name: title,
            sections
        });

        measurementType.save().then(() => {
            res.status(201).json({message: 'New measurement saved.'});
        });
    });
};