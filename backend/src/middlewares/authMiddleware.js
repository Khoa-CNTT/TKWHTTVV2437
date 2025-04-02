const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authAdminMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "Authentication error",
        status: "ERROR",
      });
    }
    if (user?.role === "admin") {
      next();
    } else {
      return res.status(404).json({
        message: "Unauthorized access",
        status: "ERROR",
      });
    }
  });
};

const authMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "Authentication error",
        status: "ERROR",
      });
    }
    if (user?.role === "9") {
      next();
    } else {
      return res.status(404).json({
        message: "Unauthorized access",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];

  const userId = req.params.id;

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "Authentication error",
        status: "ERROR",
      });
    }
    if (user?.role === "3" || user?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        message: "Unauthorized access",
        status: "ERROR",
      });
    }
  });
};

module.exports = {
  authAdminMiddleware,
  authMiddleWare,
  authUserMiddleWare,
};