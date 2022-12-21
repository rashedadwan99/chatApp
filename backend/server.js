
require("dotenv").config();
const express = require("express");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
require("colors");
const app = express();
require("./startup/db")();
require("./startup/cors")(app)
require("./startup/routes")(app);
const path = require("path")
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running")
  })
}
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.bold);
});
const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "https://simple-chat-6uvv.onrender.com",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing fronted");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing frontend");
  });
  socket.on("new message", (newMessageRecived) => {
    let chat = newMessageRecived.chat;
    if (!chat.users) return console.log("chat.users not defiend");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecived);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
