require("dotenv").config();
const { Booking } = require("../models");
const Joi = require("joi");

const bookingSchema = Joi.object({
  date: Joi.date().required(),
  startTime: Joi.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .required(),
  endTime: Joi.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .required(),
  location: Joi.string().required(),
  price: Joi.number().precision(2).positive().required(),
});

module.exports = function (io) {
  io.on("connection", async (socket) => {
    console.log("Booking Socket Connected", socket.id);

    // Get All bookings
    socket.on("requestAllBookings", async () => {
      try {
        const allBookings = await Booking.findAll();
        socket.emit("allBookings", allBookings);
      } catch (error) {
        socket.emit("bookingsFetchError", { error: error.message });
      }
    });

    // Create a New Booking
    socket.on("createBooking", async (bookingData) => {
      try {
        console.log("User ID set:in bookings", socket.request.id);

        const { error } = bookingSchema.validate(bookingData);
        if (error) {
          socket.emit("validationError", error.details[0].message);
          return;
        }

        const newBooking = await Booking.create({
          userId: socket.request.id || "001",
          ...bookingData,
        });

        socket.emit("bookingCreated", {
          booking: newBooking,
          message: "Booking created successfully",
        });
      } catch (error) {
        socket.emit("bookingCreationError", { error: error.message });
      }
    });

    // Update a Booking
    socket.on("updateBooking", async (bookingId, updatedBookingData) => {
      console.log(bookingId, updatedBookingData);
      try {
        const bookingToUpdate = await Booking.findByPk(bookingId);
        if (!bookingToUpdate) {
          socket.emit("bookingUpdateError", {
            error: "Booking not found",
          });
          return;
        }

        const { error } = bookingSchema.validate(updatedBookingData);
        if (error) {
          socket.emit("validationError", error.details[0].message);
          return;
        }

        await bookingToUpdate.update(updatedBookingData);
        socket.emit("bookingUpdated", {
          booking: bookingToUpdate,
          message: "Booking updated successfully",
        });
      } catch (error) {
        socket.emit("bookingUpdateError", {
          error: error.message,
        });
      }
    });

    // Delete a Booking
    socket.on("deleteBooking", async (bookingId) => {
      try {
        const bookingToDelete = await Booking.findByPk(bookingId);
        if (!bookingToDelete) {
          socket.emit("bookingDeleteError", {
            error: "Booking not found",
          });
          return;
        }

        await bookingToDelete.destroy();
        socket.emit("bookingDeleted", {
          message: "Booking deleted successfully",
        });
      } catch (error) {
        socket.emit("bookingDeleteError", {
          error: error.message,
        });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket Disconnected", socket.id);
    });
  });
};
