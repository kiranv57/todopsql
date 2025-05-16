import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server | null = null;
const activeConnections = new Set<string>(); // Store active socket connections

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
     origin: ["http://localhost:5173"], // Allow all origins (adjust this for production)
     methods: ["GET", "POST"],
     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    activeConnections.add(socket.id); // Add the connection to the set

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      activeConnections.delete(socket.id); // Remove the connection from the set
    });

    socket.on("todoCreated", (todo) => {
      console.log("Todo created:", todo);
      socket.broadcast.emit("todoCreated", todo); // Broadcast the event to all other clients
    }
    );
  });

  return io;
};

export const getSocketInstance = (): Server | null => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initializeSocket first.");
  }
  return io;
};

// Utility function to broadcast events
export const broadcastEvent = (socket:any, event: string, data: any) => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initializeSocket first.");
  }
  io.emit(event, data); // Emit the event to all connected clients
  
};

// Utility to get active connections
export const getActiveConnections = (): Set<string> => {
  return activeConnections;
};