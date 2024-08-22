const express = require('express');
const app = express();
const Routes = require("./Routes/route")
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');


// Routes
app.use('/', Routes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/blogs', blogRoutes);
// app.use('/comments', commentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
