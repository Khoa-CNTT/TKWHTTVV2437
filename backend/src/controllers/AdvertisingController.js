const advertisingService = require("../services/AdvertisingService");

const getListAdvertising = async (req, res) => {
  try {
    const response = await advertisingService.getListAdvertising();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

module.exports = {
  getListAdvertising,
};
