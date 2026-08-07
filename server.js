const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/User");
const Order = require("./models/Order");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// Test Route
app.get("/", (req, res) => {
  res.send("Food Delivery Backend Running 🚀");
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and Password are required",
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const newUser = new User({
      phone,
      password,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: newUser._id,
        phone: newUser.phone,
      },
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({
      phone,
      password,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Phone Number or Password",
      });
    }

    res.json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        phone: user.phone,
      },
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// ================= PLACE ORDER =================
app.post("/place-order", async (req, res) => {
    try {

        console.log("Received Order:", req.body);

        const { phone, address, items, totalAmount, paymentMethod } = req.body;

        const newOrder = new Order({
            phone,
            address,
            items,
            totalAmount,
            paymentMethod
        });

        await newOrder.save();

        console.log("Order Saved Successfully!");

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully"
        });

    } catch (err) {

        console.log("Order Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
// Start Server
app.listen(5000, () => {
  console.log("🚀 Server Running on Port 5000");
});