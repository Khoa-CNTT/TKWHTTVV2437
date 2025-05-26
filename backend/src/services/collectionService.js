const { ChromaClient } = require("chromadb");
const { getCollectionCache, setCollectionCache } = require("./cacheService");

// Configure ChromaDB client with better settings
const client = new ChromaClient({
  path: "http://localhost:8000",
  timeout: 30000, // Increased to 30 seconds
});

async function getOrCreateCollection(name) {
  let collection = getCollectionCache();

  try {
    // First try to get existing collection
    collection = await client.getCollection({
      name,
      metadata: {
        "hnsw:space": "cosine",
        "hnsw:construction_ef": 100,
        "hnsw:search_ef": 100,
        "hnsw:M": 32,
      },
    });
    console.log(`Successfully retrieved collection: ${name}`);
    setCollectionCache(collection);
    return collection;
  } catch (error) {
    console.log(`Collection ${name} not found, attempting to create...`);

    if (
      error.message &&
      (error.message.includes("not found") ||
        error.message.includes("does not exist"))
    ) {
      try {
        collection = await client.createCollection({
          name,
          metadata: {
            "hnsw:space": "cosine",
            "hnsw:construction_ef": 100,
            "hnsw:search_ef": 100,
            "hnsw:M": 64,
          },
        });
        console.log(`Successfully created collection: ${name}`);
        setCollectionCache(collection);
        return collection;
      } catch (createError) {
        console.error("Error creating collection:", createError);
        if (
          createError.message &&
          createError.message.includes("already exists")
        ) {
          console.log("Collection already exists, retrieving...");
          collection = await client.getCollection({ name });
          setCollectionCache(collection);
          return collection;
        }
        throw createError;
      }
    }
    console.error("Error getting collection:", error);
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
    console.log("Collections to delete:", JSON.stringify(collections, null, 2));

    if (!collections || collections.length === 0) {
      return { message: "No collections found to delete" };
    }

    for (const collection of collections) {
      if (!collection || !collection.name) {
        console.warn("Invalid collection object:", collection);
        continue;
      }

      try {
        console.log("Attempting to delete collection:", collection.name);
        await client.deleteCollection({
          name: collection.name,
          collectionId: collection.id || collection.name,
        });
        console.log("Successfully deleted collection:", collection.name);
      } catch (deleteError) {
        console.error(
          `Error deleting collection ${collection.name}:`,
          deleteError
        );
        // Continue with next collection instead of failing completely
      }
    }

    return { message: "Collection deletion process completed" };
  } catch (error) {
    console.error("Error in deleteAllCollections:", error);
    throw new Error("Error deleting collections: " + error.message);
  }
}

async function deleteCollection(id) {
  try {
    const collection = await getOrCreateCollection("unified_data_embeddings");
    if (!collection) {
      throw new Error("Collection not found");
    }

    // Add retry mechanism
    let retries = 3;
    while (retries > 0) {
      try {
        await collection.delete({ ids: [id] });
        return;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
    throw error;
  }
}

async function deleteAllDocuments() {
  try {
    const collection = await getOrCreateCollection("unified_data_embeddings");
    if (!collection) {
      throw new Error("Collection not found");
    }

    // Get all documents in the collection
    const allDocuments = await collection.get();
    console.log(`Found ${allDocuments.ids.length} documents to delete`);

    if (allDocuments.ids.length > 0) {
      // Delete all documents
      await collection.delete({ ids: allDocuments.ids });
      console.log("Successfully deleted all documents");
    }

    return { message: "All documents have been deleted successfully" };
  } catch (error) {
    console.error("Error deleting documents:", error);
    throw new Error("Error deleting documents: " + error.message);
  }
}

module.exports = {
  getOrCreateCollection,
  listAllCollections,
  deleteAllCollections,
  deleteCollection,
  deleteAllDocuments,
};
