require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.cookies.token;

  if (!authHeader) {
    return res.status(403).json({
      isError: true,
      message: "User needs to be logged in. Token is missing.",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      isError: true,
      message: "Invalid token format. Format should be 'Bearer <token>'.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("PAYLOAD",payload);
    req.id = payload.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        isError: true,
        message: "Session timed out. Please login again.",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        isError: true,
        message: "Invalid token.",
      });
    }

    console.error("JWT Verification Error:", error);
    return res.status(500).json({
      isError: true,
      message: "Internal server error.",
    });
  }
};

module.exports = { verifyToken };
