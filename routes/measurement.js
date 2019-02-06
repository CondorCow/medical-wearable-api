const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');

// Create a new measurement for a client
router.post(clientController.newMeasurement);

// Get all measurements from a client
router.get(clientController.getMeasurementsFromClient);

// Delete a measurement
router.delete('/:measurementId', clientController.removeMeasurement);

module.exports = router;