const { User } = require("../models");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const schema = Joi.object({
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
        const allUsers = await User.getUsers();
        socket.emit("allUsers", allUsers);
      } catch (error) {
        socket.emit("usersFetchError", { error: error.message });
      }
    });

    // Create User
    socket.on("formData", async (userData) => {
      const { error, value } = schema.validate(userData);
      if (error) {
        socket.emit("validationError", error.details[0].message);
      } else {
        try {
          const { username, email, password } = userData;

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
          socket.emit("userCreationError", { error: error.message });
        }
      }
    });

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
