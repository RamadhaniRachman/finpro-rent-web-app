import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import { startBookingCron } from "./cron/cancelExpiredBookings.js";
import bookingRoutes from "./routes/booking.route.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

startBookingCron();
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res.status(500).json({ error: "Internal Server Error" });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
