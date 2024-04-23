const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      isError: true,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};
