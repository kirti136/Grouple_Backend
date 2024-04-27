const { body, validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors)
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((error) => {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = [];
      }
      formattedErrors[error.path].push(error.msg);
    });

    return res.status(400).json({
      success: true,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  next();
};

exports.registerValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 4 })
      .withMessage("Username must be at least 4 characters long"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

exports.loginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

exports.createBookingValidationRules = () => {
  return [
    body("date")
      .exists()
      .withMessage("Date is required")
      .isDate()
      .withMessage("Invalid date format"),
    body("startTime")
      .exists()
      .withMessage("Start time is required")
      .isString()
      .withMessage("Start time must be a string"),
    body("endTime")
      .exists()
      .withMessage("End time is required")
      .isString()
      .withMessage("End time must be a string"),
    body("location")
      .exists()
      .withMessage("Location is required")
      .isString()
      .withMessage("Location must be a string"),
    body("price")
      .exists()
      .withMessage("Price is required")
      .isDecimal()
      .withMessage("Invalid price format"),
  ];
};
