import React, { useState } from 'react';
import { assignSpot } from '../../services/api';
import './AssignSpot.css';

const AssignSpot = () => {
    const [licensePlate, setLicensePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await assignSpot({ licensePlate, vehicleType });
            setMessage(`Spot assigned: ${response.data.spotNumber}`);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
      <form onSubmit={handleSubmit}>
        <label>
          License Plate:
          <input
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </label>
        <label>
          Vehicle Type:
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="bike">Bike</option>
          </select>
        </label>
        <button type="submit">Assign Spot</button>
        {message && <p>{message}</p>}
      </form>
    );
};

export default AssignSpot;