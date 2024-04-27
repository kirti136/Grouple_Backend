require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: true, message: "User not found" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: true, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Set cookies
    const prefixedToken = "Bearer " + token;
    res.cookie("token", prefixedToken, { httpOnly: true, maxAge: 3600000 });

    res.status(200).json({
      success: false,
      message: "Logged in successfully",
      token: prefixedToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: false,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};
