import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import { initSocket } from "./config/socket.js";
import connectDB from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 8080;

// Connect to DB
connectDB();

// Create HTTP + Socket server
const server = createServer(app);
initSocket(server);


server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
