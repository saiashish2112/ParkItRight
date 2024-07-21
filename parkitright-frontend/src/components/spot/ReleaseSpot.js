import React, { useState } from 'react';
import { releaseSpot } from '../../services/api';
import './ReleaseSpot.css';

const ReleaseSpot = () => {
    const [spotId, setSpotId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await releaseSpot(spotId);
            setMessage(`Spot released: ${response.data.spotNumber}`);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
      <form onSubmit={handleSubmit}>
        <label>
          Spot ID:
          <input
            type="text"
            value={spotId}
            onChange={(e) => setSpotId(e.target.value)}
          />
        </label>
        <button type="submit">Release Spot</button>
        {message && <p>{message}</p>}
      </form>
    );
};

export default ReleaseSpot;