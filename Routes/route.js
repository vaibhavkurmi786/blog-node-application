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
router.get('/index', (req, res) => {
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
    console.log("what are the email and password", email, password);
    
    const user = await User.findOne({ email });
    console.log("user", user);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/dashboard');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// router.get('/dashboard', async (req, res) => {
//     try {
//         // Assuming you have user authentication and JWT setup
//         const token = req.cookies.token;
//         console.log("Token: " + token);
        
//         if (!token) {
//             return res.redirect('/login');
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);
//         res.render('dashboard', { user });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });



module.exports = router;
