import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ParkingSpotsComponent.css";

const ParkingSpotsComponent = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/parking/availability")
      .then((response) => {
        setSpots(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Available Parking Spots
      </h1>
      <ul className="space-y-4">
        {spots.map((spot) => (
          <li key={spot._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
            <p className="text-lg font-semibold">
              Spot Number: {spot.spotNumber}
            </p>
            <p className="text-md text-gray-700">Spot Type: {spot.spotType}</p>
            <p
              className={
                spot.isOccupied
                  ? "text-red-500 font-semibold"
                  : "text-green-500 font-semibold"
              }
            >
              Occupied: {spot.isOccupied ? "Yes" : "No"}
            </p>
            {spot.vehicle && (
              <p className="text-md text-gray-700">
                Vehicle ID: {spot.vehicle}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkingSpotsComponent;
