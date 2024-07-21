const ParkingSpot = require("../models/ParkingSpot");
const Vehicle = require("../models/Vehicle");
const logger = require('../utils/logger');

exports.getAvailability = async (req, res) => {
  try {
    const availableSpots = await ParkingSpot.find({ isOccupied: false });
    logger.info('Fetched available parking spots');
    res.json(availableSpots);
  } catch (err) {
    logger.error('Error fetching available parking spots: %s', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.assignSpot = async (req, res) => {
    try {
        const { licensePlate, vehicleType } = req.body;
        const vehicle = new Vehicle({ licensePlate, vehicleType });
        await vehicle.save();
        logger.info('Saved new vehicle: %s', licensePlate);
        const spot = await ParkingSpot.findOneAndUpdate(
            { spotType: vehicleType, isOccupied: false },
            { isOccupied: true, vehicle: vehicle._id },
            {new: true}
        );
        
        if(!spot) {
            logger.warn(
              'No available spot found for vehicle: %s',
              licensePlate,
            );
            return res.status(404).json({ message: 'No available parking spot found.' });
        }
        
        logger.info(
           'Assigned spot: %s to vehicle: %s',
           spot._id,
           licensePlate,
         );
        res.json(spot);
    } catch (err) {
        logger.error('Error assigning spot: %s', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.releaseSpot = async (req, res) => {
  try {
    const { spotId } = req.params;

    if (!spotId) {
      logger.warn('Spot ID is required');
      return res.status(400).json({ message: 'Spot ID is required' });
    }

    const spot = await ParkingSpot.findByIdAndUpdate(
      spotId,
      { isOccupied: false}
    );

    console.log('spot', spot);

    if (!spot) {
      logger.warn('Spot not found: %s', spotId);
      return res.status(404).json({ message: 'Spot not found' });
    }

    if (!spot.vehicle) {
      logger.warn('No vehicle assigned to spot: %s', spotId);
      return res.status(404).json({ message: 'No vehicle assigned to spot' });
    }

    let _id = spot.vehicle
    const vehicle = await Vehicle.findByIdAndDelete(_id);
    logger.info('Released spot: %s', spot._id);
    res.json(spot);
  } catch (err) {
    logger.error('Error releasing spot: %s', err.message);
    res.status(500).json({ error: err.message });
  }
};

// exports.createAvailability = async (req, res) => {
//     try {
//         const { levelName, spots } = req.body;

//         const newlevel = new Level({ name: levelName, spots: [] });
//         await newlevel.save();
//         logger.info('Created new level: %s', levelName);

//         for(let spot of spots) {
//             const newSpot = new ParkingSpot({ ...spot, isOccupied: false });
//             await newSpot.save();
//             newlevel.spots.push(newSpot._id);
//             await newlevel.save();
//             logger.info('Created new spot: %s', newSpot._id);
//         }
//         await newlevel.save();
//         logger.info('Created new level: %s', levelName);
//         res.status(201).json(newlevel);

//     } catch (err) {
//         logger.error('Error creating availability: %s', err.message);
//         res.status(500).json({ error: err.message });
//     }
// }

exports.createParkingSpots = async (req, res) => {
    try {
        const ParkingSpots = req.body;

        if(!Array.isArray(ParkingSpots) || !ParkingSpots.length === 0) {
            logger.warn('No parking spots provided');
            return res.status(400).json({ message: 'No parking spots provided.' });
        }

        const newSpots = await ParkingSpot.insertMany(ParkingSpots);
        logger.info('Created new spots: %s', newSpots.length);

        res.status(201).json(newSpots);
    } catch (err) {
        logger.error('Error creating parking spots: %s', err.message);
        res.status(500).json({ error: err.message });
    }
};