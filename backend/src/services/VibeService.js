const db = require("../models");

class VibeService {
  // Tạo mới một Vibe
  static async createVibe(data) {
    try {
      const vibe = await db.Vibe.create(data); // Tạo mới Vibe
      return vibe;
    } catch (error) {
      throw new Error(`Error creating vibe: ${error.message}`);
    }
  }

  // Lấy tất cả các Vibe
  static async getAllVibes() {
    try {
      const vibes = await db.Vibe.findAll({
        include: [{ model: db.Address, as: "addresses" }], // Bao gồm mối quan hệ với Address
      });
      return vibes;
    } catch (error) {
      throw new Error(`Error fetching vibes: ${error.message}`);
    }
  }

  // Lấy một Vibe theo ID
  static async getVibeById(id) {
    try {
      const vibe = await db.Vibe.findByPk(id, {
        include: [{ model: db.Address, as: "addresses" }], // Bao gồm mối quan hệ với Address
      });
      if (!vibe) {
        throw new Error("Vibe not found");
      }
      return vibe;
    } catch (error) {
      throw new Error(`Error fetching vibe: ${error.message}`);
    }
  }

  // Cập nhật một Vibe theo ID
  static async updateVibe(id, data) {
    try {
      const vibe = await db.Vibe.findByPk(id); // Tìm Vibe theo ID
      if (!vibe) {
        throw new Error("Vibe not found");
      }
      await vibe.update(data); // Cập nhật Vibe
      return vibe;
    } catch (error) {
      throw new Error(`Error updating vibe: ${error.message}`);
    }
  }

  // Xóa một Vibe theo ID
  static async deleteVibe(id) {
    try {
      const vibe = await db.Vibe.findByPk(id); // Tìm Vibe theo ID
      if (!vibe) {
        throw new Error("Vibe not found");
      }
      await vibe.destroy(); // Xóa Vibe
      return vibe;
    } catch (error) {
      throw new Error(`Error deleting vibe: ${error.message}`);
    }
  }
}

module.exports = VibeService;
