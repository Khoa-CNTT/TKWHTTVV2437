const UserRouter = require("./UserRouter");
const AdminRouter = require("./AdminRouter");


const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/admin", AdminRouter);

  return app.use("/", (req, res) => {
    res.send("server on 123");
  });   
};

module.exports = initRoutes;
