const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controllers");
const {
  createBookingValidationRules,
  validate,
} = require("../middlewares/validation.middleware");
const { verifyToken } = require("../middlewares/authentication.middleware");

// Create booking route
router.post(
  "/createbooking",
  verifyToken,
  createBookingValidationRules(),
  validate,
  bookingController.createBooking
);

// Get all bookings
router.get("/", verifyToken, bookingController.getAllBookings);

// Get booking by ID route
router.get("/:id", verifyToken, bookingController.getBookingById);

// Update booking route
router.put(
  "/:id",
  verifyToken,
  createBookingValidationRules(),
  validate,
  bookingController.updateBooking
);

// Delete booking route
router.delete("/:id", verifyToken, bookingController.deleteBooking);

module.exports = router;
