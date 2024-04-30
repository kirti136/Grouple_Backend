const { Server } = require("socket.io");

module.exports = function (app) {
  const server = require("http").Server(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  require("./socket_services/user")(io);

  return server;
};
