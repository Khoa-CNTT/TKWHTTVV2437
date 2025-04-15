const categoryService = require("../services/CategoryService");

exports.getAll = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.json(categories);
};

exports.getById = async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });
  res.json(category);
};

exports.create = async (req, res) => {
  const newCategory = await categoryService.createCategory(req.body);
  res.status(201).json(newCategory);
};

exports.update = async (req, res) => {
  const updated = await categoryService.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
};

exports.delete = async (req, res) => {
  const deleted = await categoryService.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
