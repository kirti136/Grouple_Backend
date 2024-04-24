const { Booking, User } = require("../models");

exports.createBooking = async (req, res) => {
  try {
    const { date, startTime, endTime, location, price } = req.body;
    const booking = await Booking.create({
      userId: req.id,
      date,
      startTime,
      endTime,
      location,
      price,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });

    const transformedBookings = bookings.map((booking) => ({
      bookingId: booking.id,
      username: booking.User.username,
      email: booking.User.email,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      location: booking.location,
      price: booking.price,
    }));

    res.status(200).json({ success: true, data: transformedBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const transformedBooking = {
      bookingId: booking.id,
      username: booking.User.username,
      email: booking.User.email,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      location: booking.location,
      price: booking.price,
    };

    res.status(200).json({ success: true, data: transformedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { date, startTime, endTime, location, price } = req.body;

    const booking = await Booking.findOne({ where: { id: req.params.id } });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    await booking.update({
      date,
      startTime,
      endTime,
      location,
      price,
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id } });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    await booking.destroy();

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
