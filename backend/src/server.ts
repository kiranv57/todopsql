import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import todoRoutes from "./routes/todos";
import userRoutes from "./routes/user";
import { initializeSocket } from "./utils/socket";
import http from "http"; // Import the http module

const app = express();
app.use(express.json());
const PORT = 5000;

// Middleware
app.use( cors({
  origin: ["http://localhost:5173", "http://localhost:5000"], // Add your frontend's URL here
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(bodyParser.json());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/auth", userRoutes);

app.get("/hello", (_req, res) => {
  res.send("Welcome to the Todo API");
});

// Create an HTTP server
const httpServer = http.createServer(app);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  initializeSocket(httpServer);
  console.log("Socket.io initialized");
});