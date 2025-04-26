const CustomMap = require("../utils/customMap");

const embeddingCache = new CustomMap(1000, 1000 * 60 * 60); // 1 giờ
const queryResultCache = new CustomMap(500, 1000 * 60 * 15); // 15 phút
const aiResponseCache = new CustomMap(500, 1000 * 60 * 15); // 15 phút
const contextCache = new CustomMap(500, 1000 * 60 * 30); // 30 phút
let collectionCache = null;

module.exports = {
  embeddingCache,
  queryResultCache,
  aiResponseCache,
  contextCache,
  setCollectionCache: (collection) => {
    collectionCache = collection;
  },
  getCollectionCache: () => collectionCache,
  clearAllCaches: () => {
    embeddingCache.clear();
    queryResultCache.clear();
    aiResponseCache.clear();
    contextCache.clear();
    collectionCache = null;
  },
};
