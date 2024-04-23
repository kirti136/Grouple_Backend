const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/user.controllers");
const { validate } = require("../middlewares/validation.middleware");

// Register route
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("profilePicture")
      .notEmpty()
      .withMessage("Profile picture is required"),
  ],
  validate,
  userController.register
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  userController.login
);

// Logout route
router.post("/logout", userController.logout);

// Get all users route
router.get("/", userController.getAllUsers);

module.exports = router;
