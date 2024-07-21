const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

router.get('/availability', parkingController.getAvailability);
router.post('/assign', parkingController.assignSpot);
router.put('/release/:spotId', parkingController.releaseSpot);
router.post('/parking-spots', parkingController.createParkingSpots);
module.exports = router