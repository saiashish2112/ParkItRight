const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleType: {
    type: String,
    enum: ['car', 'motorcycle', 'truck'],
    required: true,
  }
});

module.exports = mongoose.model("Vehicle", VehicleSchema)