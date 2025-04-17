// controllers/embeddingController.js
const embeddingService = require("../services/AIService");

async function queryEmbeddings(req, res) {
  const { text, limit } = req.body;

  try {
    const result = await embeddingService.queryEmbeddings(text, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({
      error: "Error processing query",
      details: error.message,
    });
  }
}

module.exports = {
  queryEmbeddings,
};
