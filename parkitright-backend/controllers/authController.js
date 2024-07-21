const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const generateToken = (user) => {
    return jwt.sign({ id: user._id}, 'supersecretkey', {
        expiresIn: '1h',
    });
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        logger.info('Created new user: %s', username);
        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (err) {
        logger.error('Error creating user: %s', err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('User not found: %s', email);
            return res.status(401).json({ error: 'User not found' });
        }
        
        const token = generateToken(user);
        logger.info('Logged in user: %s', email);
        res.json({ token });
    } catch (err) {
        logger.error('Error logging in: %s', err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.logout = async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        logger.error('Error logging out: %s', err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email});
        res.json(user);
    } catch (err) {
        logger.error('Error getting profile: %s', err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        logger.error('Error updating profile: %s', err.message);
        res.status(500).json({ error: err.message });
    }
}