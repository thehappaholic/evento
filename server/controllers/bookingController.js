import Booking from "../models/bookingModel.js";
import Event from "../models/eventModel.js";

// ✅ Create Booking
export const createBooking = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Prevent duplicate booking by same user
    const existing = await Booking.findOne({ event: eventId, attendee: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already booked this event" });
    }

    // Create booking
    const booking = new Booking({
      event: eventId,
      attendee: req.user.id,
      status: "confirmed",
      paymentStatus: event.mode === "paid" ? "unpaid" : "unpaid", // extend later for payments
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get All Bookings of Logged-in User
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ attendee: req.user.id })
      .populate("event", "title date venue mode")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get All Bookings for a Host’s Event
export const getEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;

    const bookings = await Booking.find({ event: eventId })
      .populate("attendee", "name email")
      .populate("event", "title date venue");

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
