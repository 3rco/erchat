const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { format } = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () =>
  console.log(`🚀🚀🚀 Server running on port ${PORT} 🚀🚀🚀`)
);

const helper = "erchat bot";

// Run when client connects

io.on("connection", (socket) => {
  console.log("New WS Connection..");

  //only the connected user (current user) will see the message

  socket.emit("message", formatMessage(helper, "Welcome to erchat!"));

  // Broadcast when a user connects
  //emits everybody exept the user
  socket.broadcast.emit(
    "message",
    formatMessage(helper, "A user has joined the chat")
  );

  //emits everbody
  io.emit();

  //RUns when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(helper, "A user has left the chat"));
  });

  //Listen for chatMessage

  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});
