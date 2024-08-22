const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

router.get('/', async (req, res) => {
    try {
        // Check for token in cookies
        const token = req.cookies.token;
        console.log("Token received:", token);

        if (!token) {
            console.log("No token found, redirecting to login.");
            return res.redirect('/login');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Fetch user from database
        const user = await User.findById(decoded.id);
        console.log("User found:", user);

        if (!user) {
            console.log("User not found, redirecting to login.");
            return res.redirect('/login');
        }

        // Render dashboard with user data
        res.render('dashboard', { user });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
