const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let crudData = [];

io.on("connection", (socket) => {
  socket.on("data", (data) => {
    crudData.push(data);

    socket.emit("crudData", crudData);
  });

  socket.on("editData", (res) => {
    let currentIndex = crudData.findIndex((data) => data.id === res.id);
    if (currentIndex !== -1) {
      crudData[currentIndex] = { ...crudData[currentIndex], ...res };
    }
  });

  socket.on("deleteData", (id) => {
    let currentIndex = crudData.findIndex((data) => data.id === id);

    if (currentIndex !== -1) {
      crudData.splice(currentIndex, 1);
    }
  });

  setInterval(() => {
    socket.emit("crudData", crudData);
  }, 1000);
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
