const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./utils/db");

const chatSocketHandler = require("./sockets/chatSocket");
const authRoutes = require("./routes/auth.routes");
const SoloTravelerRoutes = require("./routes/SoloTraveler.routes");
const TravelAgencyRoutes = require("./routes/TravelAgency.routes");
const TripRoutes = require("./routes/Trips.routes");
const chatRoutes = require("./routes/chat.routes");
const FlightRoutes = require("./routes/Flight.routes");
const verificationRoutes = require("./routes/verification.routes");
const { isAuth } = require("./middlewares/Auth");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3300;

// CORS Configuration
const allowedOrigins = [
  "https://travel-buddy-ten-theta.vercel.app", // Frontend vercels URL
  "http://localhost:5173", // Vite dev on PC
  "http://192.168.1.11:5173", // Vite dev on mobile
  "http://localhost:3000",
  "http://192.168.1.11:3000", // For safety
];
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/SoloTraveler", isAuth, SoloTravelerRoutes);
app.use("/TravelAgency", isAuth, TravelAgencyRoutes);
app.use("/Trips", isAuth, TripRoutes);
app.use("/Chat", isAuth, chatRoutes);
app.use("/Flight", isAuth, FlightRoutes);
app.use("/verification", isAuth, verificationRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to backend zone!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Integrate Socket.IO
chatSocketHandler(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
});
