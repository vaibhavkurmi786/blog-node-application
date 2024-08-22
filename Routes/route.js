const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');

// Configure Multer for profile image uploads
const storage = multer.diskStorage({
    destination: './uploads/profiles',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

//Index Page
router.get('/', (req, res) => {
    res.render('index'); // Render the 'index.ejs' file from the 'views' directory
  });

// Serve login page
router.get('/login', (req, res) => {
    res.render('login'); // Ensure 'login.ejs' is in the 'views' directory
});

// Serve sign-up page
router.get('/sign-up', (req, res) => {
    res.render('sign-up'); // Ensure 'sign-up.ejs' is in the 'views' directory
});

// Sign Up
router.post('/sign-up', upload.single('profileImage'), async (req, res) => {
    const { email, password } = req.body;
    const profileImage = req.file ? req.file.path : '';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, profileImage });
    await user.save();
    res.redirect('/login');
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.redirect('/dashboard');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

module.exports = router;
