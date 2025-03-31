const UserRouter = require("./UserRouter");
const RoomRouter = require("./RoomRouter");

const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/room", RoomRouter);
  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
