const { ChromaClient } = require("chromadb");
const { getCollectionCache, setCollectionCache } = require("./cacheService");

const client = new ChromaClient({ path: "http://localhost:8000" });

async function getOrCreateCollection(name) {
  let collection = getCollectionCache();
  if (collection) return collection;

  try {
    collection = await client.getCollection({ name });
    setCollectionCache(collection);
    return collection;
  } catch (error) {
    if (
      error.message &&
      (error.message.includes("not found") ||
        error.message.includes("does not exist"))
    ) {
      try {
        collection = await client.createCollection({ name });
        setCollectionCache(collection);
        return collection;
      } catch (createError) {
        if (
          createError.message &&
          createError.message.includes("already exists")
        ) {
          collection = await client.getCollection({ name });
          setCollectionCache(collection);
          return collection;
        }
        throw createError;
      }
    }
    throw error;
  }
}

async function listAllCollections() {
  try {
    const collections = await client.listCollections();
    console.log("Danh sách các collection hiện có:");
    collections.forEach((collection) => console.log(`- ${collection.name}`));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách collection:", error);
  }
}

async function deleteAllCollections() {
  try {
    const collections = await client.listCollections();
    for (const collection of collections) {
      await client.deleteCollection({ name: collection.name });
    }
    return { message: "All collections deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting collections: " + error.message);
  }
}

async function deleteCollection(id) {
  try {
    const collection = await getOrCreateCollection("unified_data_embeddings");
    await collection.delete({ ids: [id] });
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

module.exports = {
  getOrCreateCollection,
  listAllCollections,
  deleteAllCollections,
  deleteCollection,
};
