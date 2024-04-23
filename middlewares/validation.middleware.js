const { body, validationResult } = require("express-validator");

const registerValidationRules = () => {
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
    body("profilePicture")
      .notEmpty()
      .withMessage("Profile picture is required"),
  ];
};

const loginValidationRules = () => {
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

const validate = (req, res, next) => {
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
      isError: true,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
