import axios from 'axios';
const API = axios.create({
    baseURL: 'http://localhost:5000/api/parking'
});

export const getAvaibility = () => API.get('/availability');
export const assignSpot = (vehicle) => API.post('/assign', vehicle);
export const releaseSpot = (spotId) => API.put(`/release/${spotId}`);
export const createParkingSpots = (spots) => API.post('/parking-spots', spots)