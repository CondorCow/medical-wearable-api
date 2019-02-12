const MeasurementType = require('../models/MeasurementType');
const MeasurementSection = require('../models/MeasurementSection');

exports.createMeasurementType = (req, res, next) => {
    const identifier = req.body.identifier;
    const name = req.body.name;
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
            identifier,
            name,
            sections
        });

        measurementType.save().then(() => {
            res.status(201).json({message: 'New measurement saved.'});
        });
    });
};

exports.getMeasurementTypes = async (req, res, next) => {
    const measurementTypes = await MeasurementType.find();
    if(measurementTypes.length !== 0) {
        return res.status(200).json({measurementTypes});
    } else {
        const error = new Error('No measurement types found.');
        error.statusCode = 404;
        next(error);
    }
};