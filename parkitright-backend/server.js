const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const parkingRoutes = require('./routes/parkingRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
// Load environment variables from .env file
dotenv.config();
connectDB();

// use middleware
app.use(cors());
app.use(express.json());

app.use('/api/parking', parkingRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
