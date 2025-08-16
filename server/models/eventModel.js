import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    flyerUrl: { type: String }, // Cloudinary URL
    description: { type: String, required: true },
    type: { type: String, enum: ["Workshop", "Webinar", "Meetup"], required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String },
    location: { type: String },
    duration: { type: Number }, // hours
    maxParticipants: { type: Number },

    mode: { type: String, enum: ["free", "paid", "rsvp"], default: "free" },
    ticketPrice: { type: Number, default: 0 },

    requirements: {
      ageFrom: { type: String },
      ageTo: { type: String },
      languages: [{ type: String }],
      materials: { type: String },
      food: { type: String },
      rules: { type: String },
    },

    survey: {
      purpose: { type: String },
      extraInfo: { type: String },
    },

    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who created it
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
