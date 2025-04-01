const UserRouter = require("./UserRouter");
const RoomRouter = require("./RoomRouter");
const CityRouter = require("./CityRouter");

const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/room", RoomRouter);
  app.use("/api/city", CityRouter);
  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
