// app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

// MongoDB replica set connection URI
const dbURI = 'mongodb://localhost:27050,localhost:27051,localhost:27052/replica?replicaSet=rs0';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB Replica Set'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Sample schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Basic route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Route to add a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  const newUser = new User({ name, email });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error saving user', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
