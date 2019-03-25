const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');

router.post('/measurementTypes', isAuth, adminController.createMeasurementType);
router.get('/measurementTypes', isAuth, adminController.getMeasurementTypes);

module.exports = router;