const UserRouter = require("./UserRouter");
const RoomRouter = require("./RoomRouter");
const CityRouter = require("./CityRouter");
const ReviewRouter = require("./ReviewRouter");
const AdminRouter = require("./AdminRouter");
const CategoryRouter = require("./CategoryRoutes");
const VibeRoutes = require("./VibeRouter");
const AddressRouter = require("./AddressRouter");
const PropertyRouter = require("./PropertyRouter");

const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/room", RoomRouter);
  app.use("/api/city", CityRouter);
  app.use("/api/review", ReviewRouter);
  app.use("/api/admin", AdminRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/addresses", AddressRouter);
  app.use("/api/vibes", VibeRoutes);
  app.use("/api/property", PropertyRouter);

  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
