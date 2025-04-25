const UserRouter = require("./UserRouter");
const PropertyRouter = require("./PropertyRouter");
const CityRouter = require("./CityRouter");
const ReviewRouter = require("./ReviewRouter");
const AdminRouter = require("./AdminRouter");
const RoomRouter = require("./RoomRouter");
const AIRouter = require("./AIRouter");
const CategoryRouter = require("./CategoryRouter");
const AmenityRouter = require("./AmenityRouter");
const HighLightRouter = require("./HighLightRouter");
const ImageRouter = require("./ImageRouter");
const ReservationRouter = require("./ReservationRouter");
const SummaryRouter = require('./SummaryRouter')

const AIServiceRouter = require("./AIRouter");

const RoomAvailabilityRouter = require('./RoomAvailibityRouter')


const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/property", PropertyRouter);
  app.use("/api/city", CityRouter);
  app.use("/api/review", ReviewRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/ai", AIServiceRouter);
  app.use("/api/admin", AdminRouter);
  app.use("/api/ai", AIRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/amenity", AmenityRouter);
  app.use("/api/summary", SummaryRouter);
  app.use("/api/highlight", HighLightRouter);
  app.use("/api/image", ImageRouter);
  app.use("/api/room-availability", RoomAvailabilityRouter);

  app.use("/api/room", RoomRouter);
  app.use("/api/reservation", ReservationRouter);
  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
