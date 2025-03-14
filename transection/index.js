require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const  connectDB = require("./config/connection");

const app = express();
app.use(express.json());
const PORT = 5000

// -----------------------for enable replecaset------------------------------//

// https://dev.to/sarwarasik/mongodb-transactions-error-transaction-numbers-are-only-allowed-on-a-replica-set-member-or-mongos-4083

// 🏦 **Transaction Route - Transfer Money (₹500 from A to B)**
app.post("/transfer", async (req, res) => {
  const { senderId, receiverId, amount } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🏦 1. Sender की Balance कम करें
    const sender = await User.findById(senderId).session(session);
    if (!sender || sender.balance < amount) {
      throw new Error("Insufficient funds!");
    }
    sender.balance -= amount;
    await sender.save({ session });

    // 🏦 2. Receiver की Balance बढ़ाएं
    const receiver = await User.findById(receiverId).session(session);
    if (!receiver) {
      throw new Error("Receiver not found!");
    }
    receiver.balance += amount;
    await receiver.save({ session });

    // ✅ 3. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: `₹${amount} transferred successfully!` });

  } catch (error) {
    await session.abortTransaction(); // ❌ Rollback if error
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Create Users (Testing Purpose)
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ success: true, user });
});

// ✅ Get All Users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
connectDB()