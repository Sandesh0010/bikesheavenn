const User = require("../models/userSchema");
const Bikes = require("../models/bikesSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// for registering user
const userSignUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "User registered successfully",
      token,
      user: { _id: user._id, id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err?.code === 11000 || err?.keyPattern?.email) {
      return res.status(409).json({ error: "User already exists" });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
};

//for login

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(402).json({ error: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(402).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(402).json({ error: "Something went wrong" });
  }
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ email: user.email, id: user._id });
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // If it's the specific "admin" credentials and doesn't exist, create it
    if (email === "admin" && password === "admin@123" && !user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashedPassword, role: "admin" });
      await user.save();
    }

    if (!user) {
      return res.status(401).json({ error: "Admin user doesn't exist" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Admin Login successful",
      token,
      user: { _id: user._id, id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete all bikes (blogs and listings) created by this user
    await Bikes.deleteMany({ createdBy: id });
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.status(200).json({ message: "User and associated content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userSignUp, userLogin, getUser, adminLogin, getAllUsers, deleteUser };
