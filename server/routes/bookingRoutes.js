import express from "express";
import { createBooking, getMyBookings, getEventBookings } from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/userAuth.js";

const bookingrouter = express.Router();

// ✅ Book an event (attendee)
bookingrouter.post("/", requireAuth, createBooking);

// ✅ Get all my bookings (attendee)
bookingrouter.get("/my", requireAuth, getMyBookings);

// ✅ Get bookings for a specific event (host)
bookingrouter.get("/event/:eventId", requireAuth, getEventBookings);

export default bookingrouter;
