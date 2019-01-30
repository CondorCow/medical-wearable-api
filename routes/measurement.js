const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');

// Create a new measurement for a client
router.post('/:clientNumber', clientController.newMeasurement);

// Get all measurements from a client
router.get('/:clientNumber', clientController.getMeasurementsFromClient);

// Delete a measurement
router.delete('/:measurementId', clientController.removeMeasurement);

module.exports = router;