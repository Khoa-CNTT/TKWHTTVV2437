const UserRouter = require("./UserRouter");
const RoomRouter = require("./RoomRouter");
const CityRouter = require("./CityRouter");
const ReviewRouter = require("./ReviewRouter");

const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/room", RoomRouter);
  app.use("/api/city", CityRouter);
  app.use("/api/review", ReviewRouter);
  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
