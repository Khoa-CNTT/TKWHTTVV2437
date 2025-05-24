const { HfInference } = require("@huggingface/inference");
const { embeddingCache } = require("./cacheService");

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
async function generateEmbedding(text) {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text);
  }
  console.log(
    process.env.HUGGINGFACE_API_KEY,
    "process.env.HUGGINGFACE_API_KEY"
  );

  const embeddingResult = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });
  console.log(embeddingResult);

  const embeddingVector = Array.isArray(embeddingResult)
    ? embeddingResult
    : embeddingResult.data || embeddingResult;

  embeddingCache.set(text, embeddingVector);
  return embeddingVector;
}

module.exports = { generateEmbedding };
