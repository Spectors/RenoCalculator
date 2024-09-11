require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // <-- Import CORS

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());  // <-- Enable CORS for all requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('Quotation Maker Backend is Running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
