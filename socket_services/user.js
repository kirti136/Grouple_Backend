const { User } = require("../models");

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
      try {
        const user = await User.createUser(userData);
        socket.emit("userCreated", {
          user,
          message: "User created successfully",
        });
      } catch (error) {
        socket.emit("userCreationError", { error: error.message });
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
