require("dotenv").config();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

module.exports = function (io) {
  io.on("connection", async (socket) => {
    console.log("User Socket Connected", socket.id);

    // Send initial data when requested
    socket.on("requestAllUsers", async () => {
      try {
        const allUsers = await User.findAll();
        socket.emit("allUsers", allUsers);
      } catch (error) {
        socket.emit("usersFetchError", { error: error.message });
      }
    });

    // Create User
    socket.on("registerUser", async (userData) => {
      try {
        const { error } = userSchema.validate(userData);
        if (error) {
          socket.emit("validationError", error.details[0].message);
          return;
        }

        const { username, email, password } = userData;

        // Check if the username already exists
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          return socket.emit("userCreationError", {
            error: "Username already exists",
          });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return socket.emit("userCreationError", {
            error: "User with this email already exists",
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

        socket.emit("userCreated", {
          user: newUser,
          message: "User created successfully",
        });
      } catch (error) {
        socket.emit("userCreationError", { error: error });
      }
    });

    // Login User
    socket.on("loginData", async (loginData) => {
      const { email, password } = loginData;

      // Check if the user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return socket.emit("loginError", {
          error: "User not found",
        });
      }

      // Validate password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return socket.emit("loginError", {
          error: "Invalid password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      socket.emit("loginSuccess", {
        message: "Logged in successfully",
        token: "Bearer " + token,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket Disconnected", socket.id);
    });

    // setInterval(async () => {
    //   try {
    //     const allUsers = await User.getUsers();
    //     socket.emit("allUsers", allUsers);
    //   } catch (error) {
    //     socket.emit("usersFetchError", { error: error.message });
    //   }
    // }, 1000);
  });
};
