const express = require("express");
require("dotenv").config();
const cors = require("cors");
const initRoutes = require("./src/routes");
const connectDatabase = require("./src/config/connectDatabase");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const ReservationService = require("./src/services/ReservationService");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

initRoutes(app);
connectDatabase();

const port = process.env.PORT || 8888;
const listener = app.listen(port, () => {
  console.log(`Server is running on the port: ${listener.address().port}`);

  cron.schedule(
    "* * * * *",
    async () => {
      try {
        console.log("Cron job triggered at", new Date().toISOString());
        await ReservationService.removeExpiredBookings();
      } catch (error) {
        console.error("Cron job failed:", error);
      }
    },
    {
      timezone: "UTC",
    }
  );
});
