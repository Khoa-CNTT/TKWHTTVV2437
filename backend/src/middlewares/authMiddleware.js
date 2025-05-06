const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authAdminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is missing",
        status: "ERROR",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token is missing",
        status: "ERROR",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
          status: "ERROR",
        });
      }

      if (user?.role === "Admin") {
        req.user = user; 
        next(); 
      } else {
        return res.status(403).json({
          message: "Unauthorized access",
          status: "ERROR",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      status: "ERROR",
      error: error.message,
    });
  }
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