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

//TODO: Do when measurements are implemented
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

exports.newMeasurement = async (req, res, next) => {
    try {
        const clientNumber = req.params.clientNumber;
        const measurements = req.body;

        const user = await User.findOne({userId: req.userId});
        const client = await Client.findOne({clientNumber: clientNumber});

        if (!client) {
            const error = new Error('Client not found.');
            error.statusCode = 404;
            throw error;
        }

        // Convert UTC date to UTC + 1
        let date = new Date();
        date.setHours(date.getHours() + 1);

        measurements.map(async m => {
            const type = await MeasurementType.findOne({name: m.measurementType});

            if (!type) {
                const error = new Error('Measurement type was not found.');
                error.statusCode = 404;
                throw error;
            }

            const measurement = new Measurement({
                measurementType: type,
                values: m.values,
                recordedBy: user,
                client: client,
                recordedAt: date
            });

            await measurement.save();
        });

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


