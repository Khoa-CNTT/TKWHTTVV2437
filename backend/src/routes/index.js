const UserRouter = require("./UserRouter");
const PropertyRouter = require("./PropertyRouter");
const CityRouter = require("./CityRouter");
const ReviewRouter = require("./ReviewRouter");
const AdminRouter = require("./AdminRouter");
const RoomRouter = require("./RoomRouter");
const ReservationRouter = require("./ReservationRouter");

const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/property", PropertyRouter);
  app.use("/api/city", CityRouter);
  app.use("/api/review", ReviewRouter);

  app.use("/api/admin", AdminRouter);
  app.use("/api/room", RoomRouter);
  app.use("/api/reservation", ReservationRouter);
  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
