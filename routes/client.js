const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');
const isAuth = require('../middleware/is-auth');

const measurementRoutes = require('./measurement');

// Create new client
router.post('/new', isAuth, clientController.createClient);

// Get all clients
router.get('/all', isAuth, clientController.getClients);

// Add new measurement
// router.use('/:clientNumber/measurements', isAuth, measurementRoutes);
router.post('/:clientNumber/measurements', isAuth, clientController.newMeasurement);

// Get all measurements from a client
router.get('/:clientNumber/measurements', isAuth, clientController.getMeasurementsFromClient);

// Delete a measurement
router.delete('/measurements/:measurementId', isAuth, clientController.removeMeasurement);

// Get a specific client
router.get('/:clientNumber', isAuth, clientController.getClient);

// Update client info
router.put('/:clientNumber', isAuth, clientController.updateClient);

// Remove client
router.delete('/:clientNumber', isAuth, clientController.removeClient);

module.exports = router;