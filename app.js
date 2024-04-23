require("dotenv").config();
const { sequelize } = require("./models");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/user", routes.userRouter);

app.get("/", (req, res) => {
  res.send("WELCOME TO GROUPLE");
});

// Check if the database is sync with provided models
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Check if the database is connected
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connected.");
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database:", error);
//   });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;

// const rateLimit = require("express-rate-limit");
// const csrf = require('@dr.pogodin/csurf')

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);
