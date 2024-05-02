const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Sign Up
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Signup Request:", req.body); // Log the JSON request body

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Signup Failed: User with same email already exists.");
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    console.log("Signup Successful:", user);
    res.json(user);
  } catch (e) {
    console.log("Signup Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Sign In
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Signin Request:", req.body); // Log the JSON request body

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Signin Failed: User with this email does not exist.");
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      console.log("Signin Failed: Incorrect password.");
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    console.log("Signin Successful:", { email: user.email, id: user._id });
    res.json({ token, ...user._doc });
  } catch (e) {
    console.log("Signin Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
