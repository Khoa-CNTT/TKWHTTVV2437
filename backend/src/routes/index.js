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
const SummaryRouter = require("./SummaryRouter");
const AdvertisingRouter = require("./AdvertisingRouter");
const PaymentRouter = require("./PaymentRoute");
const AdOrderRouter = require("./AdOrderRouter");
const CommissionPaymentRouter = require("./CommissionPaymentRouter");
const AIServiceRouter = require("./AIRouter");
const RegisterPartnerRouter = require("./RegisterPartnerRouter");

const RoomAvailabilityRouter = require("./RoomAvailibityRouter");
const AccountPaymentRouter = require("./AccountPaymentRouter");

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
  app.use("/api/advertising", AdvertisingRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/ad-order", AdOrderRouter);
  app.use("/api/commission", CommissionPaymentRouter);
  app.use("/api/partner", RegisterPartnerRouter);
  app.use("/api/room", RoomRouter);
  app.use("/api/reservation", ReservationRouter);
  app.use("/api/account-payment", AccountPaymentRouter);
  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
