import express from "express";
import { createEvent, getEvents, getEventById } from "../controllers/eventController.js";
import { requireAuth } from "../middleware/userAuth.js"; 
import upload from "../config/multer.js";

const eventrouter = express.Router();

// ✅ Create Event (protected)
eventrouter.post(
  "/",
  requireAuth,
  upload.single("flyer"), // Multer handles flyer upload
  createEvent
);

// ✅ Get All Events (public)
eventrouter.get("/", getEvents);

// ✅ Get Single Event (public)
eventrouter.get("/:id", getEventById);

export default eventrouter;
