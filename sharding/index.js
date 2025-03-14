// Importing Required Modules
const express = require("express");
const mongoose = require("mongoose");

// Express App Initialization
const app = express();
app.use(express.json());

// MongoDB Connection (Sharded Cluster)
const MONGO_URI = "mongodb://localhost:27018/myShardedDB"; // Update with mongos URL
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Sharded MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema & Model
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true }, // Sharding key
  name: String,
  email: String
});

const User = mongoose.model("User", userSchema);

// Create User API
app.post("/users", async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const newUser = new User({ userId, name, email });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Users API
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
