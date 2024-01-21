const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({
            message: "Login successful",
            token,
            userId: user._id,
        });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User({ username, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).send({
            message: "Registration successful",
            token,
            userId: user._id,
        });
    } catch (err) {
        res.status(500).send({ message: "Failed to register user" });
    }
});

module.exports = router;
