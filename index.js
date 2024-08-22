require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Routes = require("./Routes/route")
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads'));
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Routes
app.use('/', Routes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/blogs', blogRoutes);
// app.use('/comments', commentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
