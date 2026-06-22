import { Server } from 'socket.io'

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    })

  io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("register", (userId) => {

      onlineUsers.set(userId, socket.id);

      console.log("Registered:", userId);

      io.emit(
        "online-users",
        Array.from(onlineUsers.keys())
      );
    });

    socket.on("disconnect", () => {

      for (const [userId, socketId] of onlineUsers) {

        if (socketId === socket.id) {

          onlineUsers.delete(userId);

          break;
        }
      }

      io.emit(
        "online-users",
        Array.from(onlineUsers.keys())
      );

      console.log("Disconnected");
    });
  });
};

export const getIO = () => io;

export const getSocketId = (userId) => {
  return onlineUsers.get(userId);
};

// Helper to emit booking events
export const emitNewBooking = (providerUserId, booking) => {
  const socketId = onlineUsers.get(providerUserId);
  if (socketId) {
    io.to(socketId).emit("new-booking", booking);
  }
};

export const emitBookingAccepted = (userId, booking) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("booking-accepted", booking);
  }
};

export const emitBookingDeclined = (userId, booking) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("booking-declined", booking);
  }
};

export const emitBookingExpired = (userId, booking) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("booking-expired", booking);
  }
};

