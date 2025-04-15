const db = require("../models");

const createCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await db.Category.create(data); // Tạo mới Category
      resolve({
        status: "OK",
        data: category,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error creating category: ${error.message}`,
      });
    }
  });
};

const getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await db.Category.findAll(); // Lấy tất cả Category
      resolve({
        status: categories.length > 0 ? "OK" : "ERR",
        data: categories || [],
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching categories: ${error.message}`,
      });
    }
  });
};

const getCategoryById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await db.Category.findByPk(id); // Tìm Category theo ID
      if (!category) {
        resolve({
          status: "ERR",
          message: "Category not found",
        });
      } else {
        resolve({
          status: "OK",
          data: category,
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error fetching category: ${error.message}`,
      });
    }
  });
};

const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await db.Category.findByPk(id); // Tìm Category theo ID
      if (!category) {
        resolve({
          status: "ERR",
          message: "Category not found",
        });
      } else {
        await category.update(data); // Cập nhật Category
        resolve({
          status: "OK",
          data: category,
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error updating category: ${error.message}`,
      });
    }
  });
};

const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await db.Category.findByPk(id); // Tìm Category theo ID
      if (!category) {
        resolve({
          status: "ERR",
          message: "Category not found",
        });
      } else {
        await category.destroy(); // Xóa Category
        resolve({
          status: "OK",
          message: "Category deleted successfully",
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: `Error deleting category: ${error.message}`,
      });
    }
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
