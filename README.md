# ParkItRight
This application is designed to streamline the parking process by offering real-time parking availability, secure payment integration, and an intuitive user interface.
### Backend: Node.js with Express.js

### 1. Initialize the Node.js Project

```bash
mkdir parkitright-backend
cd parkitright-backend
npm init -y
npm install express mongoose cors dotenv
```

### 2. Create Project Structure

```
parkitright-backend/
├── config/
│   └── db.js
├── models/
│   └── Level.js
│   └── ParkingSpot.js
│   └── Vehicle.js
├── routes/
│   └── parking.js
├── controllers/
│   └── parkingController.js
├── .env
├── server.js
```

### 3. Create Database Configuration (**`config/db.js`**)

```jsx
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 4. Create Models

### Level Model (`models/Level.js`)

```jsx
const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true },
  spots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot' }]
});

module.exports = mongoose.model('Level', LevelSchema);

```

### ParkingSpot Model (`models/ParkingSpot.js`)

```jsx
const mongoose = require('mongoose');

const ParkingSpotSchema = new mongoose.Schema({
  spotNumber: { type: Number, required: true },
  spotType: { type: String, enum: ['car', 'motorcycle', 'truck'], required: true },
  isOccupied: { type: Boolean, default: false },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }
});

module.exports = mongoose.model('ParkingSpot', ParkingSpotSchema);

```

### Vehicle Model (`models/Vehicle.js`)

```jsx
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  licensePlate: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ['car', 'motorcycle', 'truck'], required: true }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);

```

### 5. Create Controllers (`controllers/parkingController.js`)

```jsx
const Level = require('../models/Level');
const ParkingSpot = require('../models/ParkingSpot');
const Vehicle = require('../models/Vehicle');

exports.getAvailability = async (req, res) => {
  try {
    const levels = await Level.find().populate('spots');
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignSpot = async (req, res) => {
  try {
    const { licensePlate, vehicleType } = req.body;
    const vehicle = new Vehicle({ licensePlate, vehicleType });
    await vehicle.save();

    const spot = await ParkingSpot.findOneAndUpdate(
      { spotType: vehicleType, isOccupied: false },
      { isOccupied: true, vehicle: vehicle._id },
      { new: true }
    );

    if (!spot) {
      return res.status(404).json({ message: 'No available spot found' });
    }

    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.releaseSpot = async (req, res) => {
  try {
    const { spotId } = req.params;
    const spot = await ParkingSpot.findByIdAndUpdate(
      spotId,
      { isOccupied: false, vehicle: null },
      { new: true }
    );

    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

```

### 6. Create Routes (`routes/parking.js`)

```jsx
const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

router.get('/availability', parkingController.getAvailability);
router.post('/assign', parkingController.assignSpot);
router.put('/release/:spotId', parkingController.releaseSpot);

module.exports = router;

```

### 7. Create Server File (`server.js`)

```jsx
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const parkingRoutes = require('./routes/parking');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/parking', parkingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

### 8. Create Environment Variables File (`.env`)

```
MONGO_URI=your_mongodb_connection_string

```

### Frontend: React.js

### 1. Initialize React App

```bash
npx create-react-app parkitright-frontend --template typescript
cd parkitright-frontend
npm install axios

```

### 2. Create Project Structure

```
parkitright-frontend/
├── src/
│   ├── components/
│   │   ├── ParkingAvailability.tsx
│   │   ├── AssignSpot.tsx
│   │   ├── ReleaseSpot.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── index.tsx

```

### 3. Create API Service (`src/services/api.ts`)

```tsx
import axios from 'axios';

const API = axios.create({ baseURL: '<http://localhost:5000/api/parking>' });

export const getAvailability = () => API.get('/availability');
export const assignSpot = (vehicle: { licensePlate: string, vehicleType: string }) => API.post('/assign', vehicle);
export const releaseSpot = (spotId: string) => API.put(`/release/${spotId}`);

```

### 4. Create Components

### ParkingAvailability Component (`src/components/ParkingAvailability.tsx`)

```tsx
import React, { useEffect, useState } from 'react';
import { getAvailability } from '../services/api';

const ParkingAvailability: React.FC = () => {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const response = await getAvailability();
        setLevels(response.data);
      } catch (err) {
        setError('Error fetching availability');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Parking Availability</h2>
      {levels.map(level => (
        <div key={level._id}>
          <h3>Level {level.levelNumber}</h3>
          {level.spots.map(spot => (
            <div key={spot._id}>
              <p>Spot {spot.spotNumber}: {spot.isOccupied ? 'Occupied' : 'Available'}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ParkingAvailability;

```

### AssignSpot Component (`src/components/AssignSpot.tsx`)

```tsx
import React, { useState } from 'react';
import { assignSpot } from '../services/api';

const AssignSpot: React.FC = () => {
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('car');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await assignSpot({ licensePlate, vehicleType });
      setMessage(`Spot assigned: ${response.data.spotNumber}`);
    } catch (err) {
      setMessage('Error assigning spot');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Assign Spot</h2>
      <div>
        <label>License Plate</label>
        <input
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
      </div>
      <div>
        <label>Vehicle Type</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="truck">Truck</option>
        </select>
      </div>
      <button type="submit">Assign Spot</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AssignSpot;

```

### ReleaseSpot Component (`src/components/ReleaseSpot.tsx`)

```tsx
import React, { useState } from 'react';
import { releaseSpot } from '../services/api';

const ReleaseSpot: React.FC = () => {
  const [spotId, setSpotId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await releaseSpot(spotId);
      setMessage(`Spot released: ${response.data.spotNumber}`);
    } catch (err) {
      setMessage('Error releasing spot');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Release Spot</h2>
      <div>
        <label>Spot ID</label>
        <input
          type="text"
          value={spotId}
          onChange={(e) => setSpotId(e.target.value)}
        />
      </div>
      <button type="submit">Release Spot</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ReleaseSpot;

```

### 5. Update App Component (`src/App.tsx`)

```tsx
import React from 'react';
import './App.css';
import ParkingAvailability from './components/ParkingAvailability';
import AssignSpot from './components/AssignSpot';
import ReleaseSpot from './components/ReleaseSpot';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>ParkItRight</h1>
      <ParkingAvailability />
      <AssignSpot />
      <ReleaseSpot />
    </div>
  );
};

export default App;

```

### 6. Style the App (`src/App.css`)

```css
.App {
  text-align: center;
}

h1 {
  color: #007bff;
}

form {
  margin: 20px 0;
}

form div {
  margin: 10px 0;
}

form label {
  display: block;
}

form input, form select {
  padding: 5px;
  width: 200px;
}

form button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

form button:hover {
  background-color: #0056b3;
}

```

### Run the Application

### Start the Backend Server

```bash
cd parkitright-backend
node server.js
```

### Start the Frontend Server

```bash
cd parkitright-frontend
npm start
```

This completes the implementation of the backend with Node.js and Express.js, and the frontend with React.js for the parking lot management system, `ParkItRight`. The system includes functionality to assign and release parking spots and to view the availability of parking spots in real-time.

### Features and REST APIs for ParkItRight

1. **User Authentication and Authorization**
    - **Signup**: Register a new user.
        - `POST /auth/signup`
    - **Login**: Authenticate a user and provide a token.
        - `POST /auth/login`
    - **Logout**: Invalidate the user's token.
        - `POST /auth/logout`
    - **Profile Management**: View and update user profile.
        - `GET /user/profile`
        - `PUT /user/profile`
2. **Parking Spot Management**
    - **Get All Parking Spots**: Retrieve a list of all parking spots.
        - `GET /parking-spots`
    - **Create Parking Spot**: Add a new parking spot.
        - `POST /parking-spots`
    - **Update Parking Spot**: Update details of an existing parking spot.
        - `PUT /parking-spots/:spotId`
    - **Delete Parking Spot**: Remove a parking spot from the system.
        - `DELETE /parking-spots/:spotId`
    - **Get Available Parking Spots**: Retrieve a list of available parking spots.
        - `GET /parking-spots/available`
3. **Parking Spot Availability**
    - **Get Availability**: Check the availability of parking spots.
        - `GET /availability`
    - **Reserve Spot**: Reserve a parking spot for a vehicle.
        - `POST /reserve-spot`
    - **Release Spot**: Release a reserved parking spot.
        - `PUT /release-spot/:spotId`
4. **Vehicle Management**
    - **Register Vehicle**: Register a new vehicle in the system.
        - `POST /vehicles`
    - **Update Vehicle**: Update details of an existing vehicle.
        - `PUT /vehicles/:vehicleId`
    - **Delete Vehicle**: Remove a vehicle from the system.
        - `DELETE /vehicles/:vehicleId`
    - **Get Vehicle Details**: Retrieve details of a specific vehicle.
        - `GET /vehicles/:vehicleId`
5. **Parking History and Analytics**
    - **Get Parking History**: Retrieve the parking history of a vehicle.
        - `GET /parking-history/:vehicleId`
    - **Get Spot Usage Statistics**: Retrieve usage statistics for a parking spot.
        - `GET /usage-statistics/:spotId`
6. **Notifications**
    - **Send Notification**: Send a notification to a user.
        - `POST /notifications`
    - **Get Notifications**: Retrieve notifications for a user.
        - `GET /notifications/:userId`
7. **Payment and Billing**
    - **Create Payment**: Process a payment for parking.
        - `POST /payments`
    - **Get Payment History**: Retrieve payment history for a user or vehicle.
        - `GET /payment-history/:userId`

### Detailed Example of Some APIs

### 1. User Authentication and Authorization

**Signup**

```json
POST /auth/signup
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com"
}
```

**Login**

```json
POST /auth/login
{
  "username": "john_doe",
  "password": "password123"
}
```

**Profile Management**

```json
GET /user/profile
Authorization: Bearer token

PUT /user/profile
Authorization: Bearer token
{
  "email": "john_new@example.com",
  "phone": "1234567890"
}
```

### 2. Parking Spot Management

**Get All Parking Spots**

```json
GET /parking-spots
```

**Create Parking Spot**

```json
POST /parking-spots
{
  "spotNumber": "PS300",
  "spotType": "car",
  "isOccupied": false
}
```

**Update Parking Spot**

```json
PUT /parking-spots/:spotId
{
  "spotType": "motorcycle",
  "isOccupied": true
}
```

**Delete Parking Spot**

```json
DELETE /parking-spots/:spotId
```

**Get Available Parking Spots**

```json
GET /parking-spots/available
```

### 3. Parking Spot Availability

**Get Availability**

```json
GET /availability
```

**Reserve Spot**

```json
POST /reserve-spot
{
  "spotId": "60d21b4667d0d8992e610c85",
  "licensePlate": "ABC1234",
  "vehicleType": "car"
}
```

**Release Spot**

```json
PUT /release-spot/:spotId
{
  "spotId": "60d21b4667d0d8992e610c85"
}
```

### Summary

These features and their corresponding REST APIs provide a robust foundation for the ParkItRight app. They cover essential aspects such as user management, parking spot management, vehicle management, parking history, notifications, and payment processing. Each feature includes necessary endpoints to perform CRUD operations and other specific actions required for effective parking lot management.