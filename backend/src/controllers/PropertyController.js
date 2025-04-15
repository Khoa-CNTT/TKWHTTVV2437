const PropertyService = require("../services/PropertyService");

const getAllProperties = async (req, res) => {
  try {
    const properties = await PropertyService.getAllProperties();
    return res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await PropertyService.getPropertyById(id);
    return res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property" });
  }
};

const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    console.log("Creating property with data:", req.body);

    const property = await PropertyService.createProperty(propertyData);
    return res.status(201).json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create property" });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    // Logic to update property
    const property = await PropertyService.updateProperty(id, updatedData);
    return res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    // Logic to delete property
    const property = await PropertyService.deleteProperty(id);
    return res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};
module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
