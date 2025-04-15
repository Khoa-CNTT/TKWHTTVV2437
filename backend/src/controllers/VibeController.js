const vibeService = require("../services/VibeService");

exports.getAll = async (req, res) => {
  try {
    const vibes = await vibeService.getAllVibes();
    res.json(vibes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const vibe = await vibeService.getVibeById(req.params.id);
    if (!vibe) return res.status(404).json({ message: "Not found" });
    res.json(vibe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newVibe = await vibeService.createVibe(req.body);
    res.status(201).json(newVibe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await vibeService.updateVibe(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await vibeService.deleteVibe(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
