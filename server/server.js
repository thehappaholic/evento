import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";
import eventrouter from "./routes/eventRoutes.js";
import bookingrouter from "./routes/bookingRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json({ strict: false }));
app.use(cookieParser());
app.use(cors({
  origin: "http://127.0.0.1:5500", // frontend origin
  credentials: true
}));

//API Endpoints
app.get("/", (req, res) => res.send("API is running"));
app.use("/api/auth", authRouter);
app.use("/api/auth", userRouter);
app.use("/api/events", eventrouter);
app.use("/api/bookings", bookingrouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});