const initRoutes = (app) => {
  return app.use("/", (req, res) => {
    res.send("server on 123");
  });
};

module.exports = initRoutes;
