const Client = require('../models/client');
const User = require('../models/user');
const MeasurementSection = require('../models/MeasurementSection');
const MeasurementType = require('../models/MeasurementType');
const MeasurementSectionValue = require('../models/MeasurementSectionValue');
const Measurement = require('../models/Measurement');
const mongoose = require('mongoose');

exports.createClient = async (req, res, next) => {
    try {
        const {name, lastName, address, postalCode, city, telephone} = req.body;

        let client = new Client({
            name: name,
            lastName: lastName,
            address: address,
            postalCode: postalCode,
            city: city,
            telephone: telephone
        });

        let savedClient = await client.save();
        res.status(201).json({
            message: 'Client created.',
            clientId: savedClient._id,
            clientNumber: savedClient.clientNumber
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
};

exports.getClient = async (req, res, next) => {
    const clientNumber = req.params.clientNumber;

    try {
        let foundClient = await Client.findOne({clientNumber: clientNumber});
        if (!foundClient) {
            const error = new Error('No client with this clientnumber was found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({foundClient: foundClient})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getClients = (req, res, next) => {
    Client.find()
        .then(result => {
            if (result.length === 0) {
                const error = new Error('No clients found.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({clients: result});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateClient = async (req, res, next) => {
    const clientNumber = req.params.clientNumber;

    let client = await Client.findOne({clientNumber: clientNumber});

    if (!client) {
        return res.status(404).json({message: 'No client with this clientnumber was found.'});
    }
    const newInfo = {
        name: req.body.name || client.name,
        lastName: req.body.lastName || client.lastName,
        address: req.body.address || client.address,
        postalCode: req.body.postalCode || client.postalCode,
        city: req.body.city || client.city,
        telephone: req.body.telephone || client.telephone
    };

    Client.update({clientNumber: clientNumber}, {
        ...newInfo
    }, (err, affected) => {
        console.log(affected);
        if (affected.nModified <= 0) {
            return res.status(200).json({message: 'Nothing was updated.'})
        } else if (err) {
            return res.status(500).json({message: `Something went wrong: ${err.message}`})
        }
        res.status(200).json({message: 'Client updated'});
    });
};

exports.removeClient = async (req, res, next) => {
    const clientNumber = req.params.clientNumber;

    try {
        let foundClient = await Client.findOne({clientNumber: clientNumber});
        if (!foundClient) {
            const error = new Error('No client with this clientnumber was found.');
            error.statusCode = 404;
            throw error;
        }

        // Delete all relations with measurements of this specific client
        Measurement.find({'client': foundClient._id}).remove(result => {
            foundClient.delete();
            return res.status(200).json({message: 'Client removed.'});
        });

        // res.status(200).json({message: 'Client deleted.'});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getMeasurementsFromClient = async (req, res, next) => {
    try {
        const clientNumber = req.params.clientNumber;
        const foundClient = await Client.findOne({clientNumber: clientNumber});
        if (!foundClient) {
            console.log('error');
            const error = new Error('No client with this clientnumber was found.');
            error.statusCode = 404;
            throw error;
        }
        const measurements = await Measurement.find({'client': foundClient._id}).populate('measurementTypeId');
        if (measurements.length !== 0) {
            return res.status(200).json({measurements});
        } else {
            const error = new Error('No measurements.');
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
};

exports.newMeasurement = async (req, res, next) => {
    try {
        const clientNumber = req.params.clientNumber;
        const measurements = req.body;

        const user = req.user; //await User.findOne({_id: req.userId});
        const client = await Client.findOne({clientNumber: clientNumber});

        if (!client) {
            const error = new Error('Client not found.');
            error.statusCode = 404;
            throw error;
        }

        // Convert UTC date to UTC + 1
        let date = new Date();
        date.setHours(date.getHours() + 1);

        for (const m of measurements) {
            // Check if measurementType exists
            const type = await MeasurementType.findOne({_id: m.measurementTypeId});//.lean().populate({path: 'sections'});
            if (!type) {
                const error = new Error('Measurement type was not found.');
                error.statusCode = 404;
                throw error;
            }
            console.log('TYPE:', type);

            // Check sections of type
            const typeSections = type.sections;
            const ids = typeSections.map(section => {
                return section._id.toString()
            });

            let hasDifference = false;
            const requestIds = m.values.map(s => s.sectionId);
            console.log("ids", ids);
            console.log("request", requestIds);
            requestIds.forEach(id => {
                if (!ids.includes(id)) {
                    hasDifference = true
                }
            });

            const isInvalid = (requestIds.length > ids.length) || ([...new Set(requestIds)].length !== requestIds.length);

            if (hasDifference || isInvalid) {
                const error = new Error('No values or found invalid sections.');
                error.statusCode = 422;
                throw error;
            }

            // get all MeasurementSection
            const sections = await MeasurementSection.find({
                _id: {
                    $in: m.values.map(v => v.sectionId)
                }
            });

            const toSaveValues = m.values.map(v => {
                const section = sections.find(s => s.id === v.sectionId);
                // const section = await MeasurementSection.findOne({_id: v.sectionId});
                return new MeasurementSectionValue({
                    section: section,
                    value: v.value
                });
            });

            // const results = await Promise.all(toSaveValues);
            console.log("toSaveValues", toSaveValues);

            const measurement = new Measurement({
                measurementTypeId: type,
                values: toSaveValues,
                recordedBy: user,
                client: client,
                recordedAt: date
            });

            await measurement.save();
            return res.status(200).json({message: 'Measurement saved.'})
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// remove a specific measurement
exports.removeMeasurement = async (req, res, next) => {
    const measurementId = req.params.measurementId;

    try {
        if (!mongoose.Types.ObjectId.isValid(measurementId)) {
            throw new Error('Measurement not found.');
        }
        const removedMeasurement = await Measurement.remove({_id: measurementId});
        res.status(200).json({message: 'Measurement removed.', id: removedMeasurement._id})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


