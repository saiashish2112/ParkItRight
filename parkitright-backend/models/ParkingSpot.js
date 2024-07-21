const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ParkingSpotSchema = new mongoose.Schema({
  spotNumber: {
    type: String,
    required: true,
    uniique: true,
  },
  spotType: {
    type: String,
    required: true,
    enum: ['car', 'motorcycle', 'truck'],
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
});

module.exports = mongoose.model("ParkingSpot", ParkingSpotSchema);