const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');

// Create a new measurement for a client
router.post('/:clientNumber', clientController.newMeasurement);

// Delete a measurement
router.delete('/:clientNumber', clientController.removeMeasurement);

module.exports = router;