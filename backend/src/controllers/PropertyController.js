const PropertyService = require("../services/PropertyService");

const listTop10HomestayRating = async (req, res) => {
  try {
    const response = await PropertyService.listTop10HomestayRating();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getPropertyIdByUserId = async (req, res) => {
  try {
    const response = await PropertyService.getPropertyIdByUserId(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDetailBySlug = async (req, res) => {
  try {
    const response = await PropertyService.getDetailBySlug(req.params.slug);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDetailProperyById = async (req, res) => {
  try {
    const response = await PropertyService.getDetailProperyById(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getDetailProperyByUserId = async (req, res) => {
  try {
    const response = await PropertyService.getDetailProperyByUserId(
      req.params.id
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getListSearchText = async (req, res) => {
  try {
    const response = await PropertyService.getListSearchText(req.query.text);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const createProperty = async (req, res) => {
  try {
    const response = await PropertyService.createProperty(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller: " + (error.message || error), // Nếu có lỗi message, trả về lỗi đó, nếu không thì trả về toàn bộ lỗi.
    });
  }
};

const updateProperty = async (req, res) => {
  try {
    const response = await PropertyService.updateProperty(
      req.params.id,
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller: " + (error.message || error), // Nếu có lỗi message, trả về lỗi đó, nếu không thì trả về toàn bộ lỗi.
    });
  }
};

const getListAmenityByPropertyId = async (req, res) => {
  try {
    const response = await PropertyService.getListAmenityByPropertyId(
      req.params.id
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getListHightlightByPropertyId = async (req, res) => {
  try {
    const response = await PropertyService.getListHightlightByPropertyId(
      req.params.id
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      msg: "Error in controller : " + error,
    });
  }
};

const getListProperty = async (req, res) => {
  try {
    const response = await PropertyService.getListProperty(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      msg: `Error in controller: ${error.message || JSON.stringify(error)}`,
    });
  }
};

module.exports = {
  // fetchFullData,
  createProperty,
  listTop10HomestayRating,
  getDetailBySlug,
  getDetailProperyById,
  getListAmenityByPropertyId,
  getListHightlightByPropertyId,
  updateProperty,
  getListProperty,
  getListSearchText,
  getDetailProperyByUserId,
  getPropertyIdByUserId,
};
