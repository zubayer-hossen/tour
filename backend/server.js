require('dotenv').config(); // Add dotenv to load environment variables

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const path = require('path');


// Allow specific origin (frontend URL)
const corsOptions = {
  origin: "https://special-economics-care-tour-register.onrender.com",  // Frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};



// Initialize the app
const app = express();
// Apply CORS settings globally
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB using the URI from the environment variables
mongoose.connect(process.env.MONGO_URI, {

}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Database connection error:', err);
});

// Routes
app.use('/api/users', userRouter);

// Serve PDF files
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// Port
const PORT = process.env.PORT || 5000;  // Use process.env.PORT for production or fallback to 5000 for local
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
