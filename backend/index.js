const express = require("express");
require("dotenv").config();
const cors = require("cors");
const initRoutes = require("./src/routes");
const connectDatabase = require("./src/config/connectDatabase");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

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
// app.use((req, res, next) => {
//   let sessionId = req.headers["x-session-id"] || req.query.sessionId;
//   if (!sessionId) {
//     sessionId = uuidv4();
//     console.log("Generated new sessionId:", sessionId);
//   } else {
//     console.log("Reusing sessionId from client:", sessionId);
//   }
//   req.sessionId = sessionId;
//   res.setHeader("x-session-id", sessionId);
//   next();
// });

app.use(cookieParser());

initRoutes(app);
connectDatabase();

const port = process.env.PORT || 8888;
const listener = app.listen(port, () => {
  console.log(`Server is running on the port: ${listener.address().port}`);
});
