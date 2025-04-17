import categoryService from "../services/CategoryService";
exports.getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.create = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await categoryService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};
