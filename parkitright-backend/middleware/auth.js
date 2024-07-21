const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            logger.warn('No token found');
            return res.status(401).json({ error: 'No token found' });
        }

        const decoded = jwt.verify(token, 'supersecretkey');

        const user = await User.findById(decoded.id);
        if (!user) {
            logger.warn('User not found');
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;

        next();
    } catch (err) {
        logger.error('Error protecting route: %s', err.message);
        res.status(500).json({ error: err.message });
    }
}