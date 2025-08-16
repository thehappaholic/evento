import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    attendee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled"], 
      default: "confirmed" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["unpaid", "paid"], 
      default: "unpaid" 
    },
    bookedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
