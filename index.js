require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Routes = require("./Routes/route")
const dashboardRoutes = require("./Routes/dashboard")
const commentRoutes = require("./Routes/comment")
const blogRoutes = require("./Routes/blog")
const port = 3000;
const cookieParser = require('cookie-parser');
const path = require('path');
// Use cookie-parser middleware
app.use(cookieParser());

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('uploads'));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'uploads', 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('Connected to MongoDB')
});

// Routes
app.use('/', Routes);
app.use('/dashboard', dashboardRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
