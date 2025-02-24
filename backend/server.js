require('dotenv').config(); // Add dotenv to load environment variables

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const path = require('path');


const corsOptions = {
  origin: 'https://special-economics-care-tour-register.onrender.com',  // Allow only this frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies and credentials to be included in requests
  preflightContinue: false,  // Let Express handle preflight requests automatically
  optionsSuccessStatus: 204  // Status code for successful OPTIONS requests
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
const PORT = 'https://tour-user.onrender.com' || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
