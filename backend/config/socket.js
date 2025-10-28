import { Server } from "socket.io";
import Notification from "../src/models/notification.model.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
     origin: "http://localhost:5173",
    credentials:true,
    exposeHeaders: ['Access-Control-Allow-Credentials'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
    },
  });

  console.log("⚡ Socket.io initialized");

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // Join room based on user ID (to send private notifications)
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`👥 User ${userId} joined room`);
    });

    // Doctor or Admin assigns priority → notify patient
    socket.on("priorityUpdated", async (data) => {
      const { patientId, priority, doctorId } = data;

      // Save notification in DB
      await saveNotification({
        userId: patientId,
        message: `Your appointment has been marked as ${priority.toUpperCase()} priority.`,
        from: doctorId,
      });

      // Emit to patient
      io.to(patientId).emit("newNotification", {
        message: `Your appointment has been marked as ${priority} priority.`,
      });
    });

    // New appointment booked → notify doctor/admin
    socket.on("newAppointment", async (data) => {
      const { doctorId, patientName, description } = data;

      await Notification({
        userId: doctorId,
        message: `New appointment request from ${patientName}: "${description}"`,
      });

      io.to(doctorId).emit("newNotification", {
        message: `New appointment request from ${patientName}`,
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Export io instance to use globally
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
