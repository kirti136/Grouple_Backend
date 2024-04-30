require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/user", routes.userRouter);
app.use("/api/booking", routes.bookingRouter);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
    const server = require("./socket")(app);
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = app;

// standalone
// require("dotenv").config();
// const express = require("express");
// const { Server } = require("socket.io");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const helmet = require("helmet");
// const { sequelize, User } = require("./models");
// const routes = require("./routes");

// const app = express();
// const server = require("http").Server(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// io.on("connection", async (socket) => {
//   console.log("Socket Connected", socket.id);

//   // Create User
//   socket.on("formData", async (userData) => {
//     try {
//       await User.createUser(userData);
//       socket.emit("userCreated", "User Created Successfully");
//     } catch (error) {
//       socket.emit("userCreationError", { error: error.message });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket Disconnected", socket.id);
//   });

//   setInterval(async () => {
//     try {
//       const allUsers = await User.getUsers();
//       socket.emit("allUsers", allUsers);
//     } catch (error) {
//       socket.emit("usersFetchError", { error: error.message });
//     }
//   }, 1000);
// });

// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // app.use("/api/user", routes.userRouter);
// // app.use("/api/booking", routes.bookingRouter);

// app.get("/", (req, res) => {
//   res.send("WELCOME TO GROUPLE");
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connected.");
//     server.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database:", error);
//   });

// module.exports = app;
