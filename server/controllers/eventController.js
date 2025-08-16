import Event from "../models/eventModel.js";

// ✅ Create Event (with flyer upload handled in route)
export const createEvent = async (req, res) => {
  try {
    const { 
      title, description, type, date, time, venue, location,
      duration, maxParticipants, mode, ticketPrice,
      requirements, survey 
    } = req.body;

    // Flyer comes from multer-cloudinary upload
    const flyerUrl = req.file ? req.file.path : null;

    const event = new Event({
      title,
      flyerUrl,
      description,
      type,
      date,
      time,
      venue,
      location,
      duration,
      maxParticipants,
      mode,
      ticketPrice,
      requirements: requirements ? JSON.parse(requirements) : {},
      survey: survey ? JSON.parse(survey) : {},
      host: req.user.id, // From JWT middleware
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("host", "name email");
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("host", "name email");
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
