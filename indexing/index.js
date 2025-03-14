const express = require("express");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");


const app = express();
app.use(express.json());
const PORT = 4000
mongoose
  .connect("mongodb://127.0.0.1:27017/indexing_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  createdAt: { type: Date, default: Date.now },
});

// **Indexing Lagayenge**
userSchema.index({ age: 1 }, { background: true }); // Background indexing

const User = mongoose.model("User", userSchema);

// **1. Dummy Data Generate Karna**
app.get("/generate-data", async (req, res) => {
  let users = [];
  for (let i = 0; i < 514; i++) {
    users.push({
      name: faker.person.fullName(), // ✅ Updated
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 60 }), // ✅ Updated
    });
  }
  await User.insertMany(users);
  res.send("Users Inserted");
});

// **2. Normal Query Without Indexing**
app.get("/users/without-index", async (req, res) => {
  console.time("Without Index");
  let users = await User.find({ age: 30 }).lean();
  console.timeEnd("Without Index");
  res.json(users);
});

// **3. Optimized Query With Indexing**
app.get("/users/with-index", async (req, res) => {
  console.time("With Index");
  let users = await User.find({ age: 30 }).hint({ age: 1 }).lean();
  console.timeEnd("With Index");
  res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });