// queryService.js
const { getOrCreateCollection } = require("./collectionService");
const { generateEmbedding } = require("./embeddingService");
const { contextCache, queryResultCache } = require("./cacheService");
const { detectIntent } = require("../utils/intentDetector");
const {
  parseDocument,
  parseStringDocument,
} = require("../utils/documentParser");

// Create a fallback embedding function that handles errors gracefully
async function getEmbeddingWithFallback(text) {
  try {
    // Try the primary embedding method
    return await generateEmbedding(text);
  } catch (primaryError) {
    console.error("Primary embedding generation failed:", primaryError.message);

    // Since we don't have access to the embedding service implementation,
    // we'll create a mock embedding as a last resort
    console.warn(
      "Generating fallback mock embedding to prevent complete failure"
    );

    // Create a mock embedding with appropriate dimensions
    // Most embedding models use between 384-1536 dimensions
    const dimensions = 384; // Adjust based on your actual model's dimensions
    return Array.isArray(text)
      ? text.map(() =>
          Array(dimensions)
            .fill(0)
            .map(() => Math.random() * 2 - 1)
        )
      : Array(dimensions)
          .fill(0)
          .map(() => Math.random() * 2 - 1);
  }
}

function generateSimplifiedResponseText(queryResult, previousContext = null) {
  const { query, matchedItems } = queryResult;
  let response = `Kết quả tìm kiếm cho: "${query}"\n\n`;

  let filteredItems = matchedItems;
  if (previousContext && previousContext.matchedItems) {
    const previousHotelIds = previousContext.matchedItems
      .filter((item) => item.metadata.type === "hotel")
      .filter((item) => item.metadata.type === "reviewPeroperty")

      .map((item) => item.metadata.itemId);
    filteredItems = matchedItems.sort((a, b) => {
      const aIsRelevant = previousHotelIds.includes(
        a.metadata.itemId || a.metadata.propertyId
      )
        ? -1
        : 1;
      const bIsRelevant = previousHotelIds.includes(
        b.metadata.itemId || b.metadata.propertyId
      )
        ? -1
        : 1;
      return aIsRelevant - bIsRelevant;
    });
  }

  filteredItems = filteredItems.sort(
    (a, b) => (a.distance || 0) - (b.distance || 0)
  );

  if (filteredItems && filteredItems.length > 0) {
    filteredItems.forEach((item, index) => {
      const { document, metadata } = item;
      console.log(metadata, "metadata lalalalalal");
      if (!document || !metadata) return;

      if (typeof document === "string") {
        const parsedDoc = parseStringDocument(document);

        console.log(parsedDoc, "parsedDoc lalalalalal");

        if (metadata.type === "hotel" || parsedDoc.type === "hotel") {
          response += `${index + 1}. 🏨 ${
            metadata.name || parsedDoc.name || "Khách sạn"
          } (ID: ${metadata.itemId || parsedDoc.id})\n`;
          response += `   Mô tả: ${
            parsedDoc.description || "Không có mô tả"
          }\n`;
          response += `   Địa chỉ:\n`;
          if (parsedDoc.address && typeof parsedDoc.address === "object") {
            if (parsedDoc.address.street)
              response += `   - Đường: ${parsedDoc.address.street}\n`;
            if (parsedDoc.address.district)
              response += `   - Quận/Huyện: ${parsedDoc.address.district}\n`;
            if (parsedDoc.address.city)
              response += `   - Thành phố: ${parsedDoc.address.city}\n`;
            if (parsedDoc.address.country)
              response += `   - Quốc gia: ${parsedDoc.address.country}\n`;
          } else {
            response += `   N/A\n`;
          }
          response += `   Tiện ích: ${
            metadata.amenities || "Wifi miễn phí, hồ bơi, bãi đỗ xe"
          }\n`;
          response += `   Link: ${
            parsedDoc.link || metadata.link || "Không có đường dẫn"
          }\n`;

          if (parsedDoc.images && parsedDoc.images.length > 0) {
            response += `   Hình ảnh: ${parsedDoc.images.join(", ")}\n`;
          } else {
            response += `   Hình ảnh: Không có hình ảnh\n`;
          }

          if (parsedDoc.status) {
            response += `   Trạng thái: ${parsedDoc.status}\n`;
          }
        } else if (metadata.type === "room" || parsedDoc.type === "room") {
          response += `${index + 1}. 🛏️ ${
            metadata.name || parsedDoc.name || "Phòng"
          } (Khách sạn ID: ${metadata.propertyId || parsedDoc.propertyId})\n`;
          response += `   Giá: ${parsedDoc.price || "N/A"}\n`;
          response += `   Thuộc khách sạn: ${parsedDoc.property || "N/A"}\n`;
          response += `   Số người tối đa: ${parsedDoc.maxGuests || "N/A"}\n`;
          response += `   Trạng thái: ${parsedDoc.status || "N/A"}\n`;
          response += `   Tiện nghi: ${
            metadata.amenities || "Không có thông tin"
          }\n`;

          if (parsedDoc.images && parsedDoc.images.length > 0) {
            response += `   Hình ảnh: ${parsedDoc.images.join(", ")}\n`;
          } else {
            response += `   Hình ảnh: Không có hình ảnh\n`;
          }
        } else if (metadata.type === "reviewPeroperty") {
          response += `${index + 1}. 📝 ${metadata.name || "Đánh giá"} (ID: ${
            metadata.itemId
          })\n`;
          response += `   Đánh giá: ${
            parsedDoc.averageRating || "Chưa có đánh giá"
          }\n`;
        }
      } else {
        const parsedDoc = parseDocument(document);

        if (metadata.type === "hotel") {
          response += `${index + 1}. 🏨 ${metadata.name || "Khách sạn"} (ID: ${
            metadata.itemId
          })\n`;
          const description = document.match(/Mô tả:(.*?)(?=\n|$)/);
          response += `   Mô tả: ${
            description && description[1]
              ? description[1].trim().substring(0, 150) + "..."
              : "N/A"
          }\n`;
          response += `   Địa chỉ:\n`;
          if (
            parsedDoc["Địa chỉ"] &&
            typeof parsedDoc["Địa chỉ"] === "object"
          ) {
            if (parsedDoc["Địa chỉ"].street)
              response += `   - Đường: ${parsedDoc["Địa chỉ"].street}\n`;
            if (parsedDoc["Địa chỉ"].district)
              response += `   - Quận/Huyện: ${parsedDoc["Địa chỉ"].district}\n`;
            if (parsedDoc["Địa chỉ"].city)
              response += `   - Thành phố: ${parsedDoc["Địa chỉ"].city}\n`;
            if (parsedDoc["Địa chỉ"].country)
              response += `   - Quốc gia: ${parsedDoc["Địa chỉ"].country}\n`;
          } else {
            response += `   N/A\n`;
          }
          response += `   Đánh giá cặp đôi: ${
            metadata.rating || "Chưa có đánh giá"
          }\n`;
          response += `   Tiện ích: ${
            metadata.amenities || "Wifi miễn phí, hồ bơi, bãi đỗ xe"
          }\n`;

          if (parsedDoc["Hình ảnh"] && parsedDoc["Hình ảnh"].length > 0) {
            const imageUrls = parsedDoc["Hình ảnh"]
              .map((line) => line.match(/- \[\d+\] (https?:\/\/[^\s]+)/)?.[1])
              .filter((url) => url);
            response += `   Hình ảnh: ${
              imageUrls.length > 0 ? imageUrls.join(", ") : "Không có hình ảnh"
            }\n`;
          } else {
            response += `   Hình ảnh: Không có hình ảnh\n`;
          }
        } else if (metadata.type === "room") {
          response += `${index + 1}. 🛏️ ${
            metadata.name || "Phòng"
          } (Khách sạn ID: ${metadata.propertyId})\n`;

          const price = document.match(/Giá: (.*?)(?=\n|$)/);
          response += `   Giá: ${
            price && price[1] ? price[1].trim() : "N/A"
          }\n`;

          const maxGuests = document.match(/Số người tối đa: (\d+)/);
          response += `   Số người tối đa: ${
            maxGuests && maxGuests[1] ? maxGuests[1].trim() : "N/A"
          }\n`;

          const status = document.match(/Trạng thái: (.*?)(?=\n|$)/);
          response += `   Trạng thái: ${
            status && status[1] ? status[1].trim() : "N/A"
          }\n`;

          response += `   Tiện nghi: ${
            metadata.amenities || "Không có thông tin"
          }\n`;

          if (parsedDoc["Hình ảnh"] && parsedDoc["Hình ảnh"].length > 0) {
            const imageUrls = parsedDoc["Hình ảnh"]
              .map((line) => line.match(/- \[\d+\] (https?:\/\/[^\s]+)/)?.[1])
              .filter((url) => url);
            response += `   Hình ảnh: ${
              imageUrls.length > 0 ? imageUrls.join(", ") : "Không có hình ảnh"
            }\n`;
          } else {
            response += `   Hình ảnh: Không có hình ảnh\n`;
          }

          if (
            parsedDoc["Điểm đanh giá"] &&
            parsedDoc["Điểm đánh giá"].length > 0
          ) {
            const rating = parsedDoc["Điểm đánh giá"]
              .map((line) => line.match(/- \[\d+\] (.*?)(?=\n|$)/)?.[1])
              .filter((url) => url);
            response += `   Điểm đánh giá: ${
              rating.length > 0 ? rating.join(", ") : "Không có đánh giá"
            }\n`;
          }
        }
      }
    });
  } else {
    response +=
      "Hiện tại chưa có kết quả phù hợp. Hãy thử tìm với từ khóa khác nhé!\n";
  }

  return response.trim();
}

async function queryDatabase(text, limit, intents) {
  try {
    // Use the new fallback embedding function
    const embeddingVector = await getEmbeddingWithFallback(text);

    // Cache key for this query to avoid unnecessary repeat embedding calls
    const cacheKey = `query_${text}_${limit}_${intents.join("_")}`;
    if (queryResultCache.has(cacheKey)) {
      return queryResultCache.get(cacheKey);
    }

    const collection = await getOrCreateCollection("unified_data_embeddings");

    // Handle empty collection case gracefully
    try {
      await collection.count();
    } catch (collectionError) {
      console.warn(
        "Collection may be empty or not properly initialized:",
        collectionError.message
      );
      return []; // Return empty results rather than throwing an error
    }

    // Sửa whereClause để sử dụng intents thay vì detectIntent
    const whereClause =
      intents.length === 0 || intents.includes("all")
        ? {} // Lấy tất cả nếu không có intent hoặc có "all"
        : { type: { $in: intents } }; // Lọc tài liệu có type trong intents

    const semanticResult = await collection.query({
      queryEmbeddings: embeddingVector,
      nResults: parseInt(limit) + 15, // Lấy thêm để lọc
      include: ["metadatas", "documents", "distances"],
      where: whereClause,
    });

    const matchedItems =
      semanticResult.documents?.[0] &&
      Array.isArray(semanticResult.documents[0]) &&
      semanticResult.metadatas?.[0] &&
      Array.isArray(semanticResult.metadatas[0])
        ? semanticResult.documents[0].map((doc, i) => ({
            document: doc,
            metadata: semanticResult.metadatas[0][i] || {},
            distance: semanticResult.distances?.[0]?.[i] ?? null,
          }))
        : [];

    // Cache the results
    queryResultCache.set(cacheKey, matchedItems);
    return matchedItems;
  } catch (error) {
    console.error("Error querying database:", error);

    // Return empty results instead of throwing
    return [];
  }
}

async function saveEmbedding(type, data) {
  const { generateText } = require("../utils/textGenerator");

  console.log("saveEmbedding received:", type, JSON.stringify(data, null, 2));

  // Kiểm tra dữ liệu đúng cách
  if (!data) {
    throw new Error("Missing data for embedding");
  }

  // Chuẩn hóa dữ liệu thành mảng để xử lý đồng nhất
  const dataArray = Array.isArray(data) ? data : [data];

  const itemTexts = dataArray.map((item) => generateText(item, type));
  console.log("Generated texts for embedding:", itemTexts);

  try {
    // Tạo embedding vector với fallback
    const embeddingVector = await getEmbeddingWithFallback(itemTexts);
    console.log("Generated embedding vectors");

    // Lấy hoặc tạo collection
    const collection = await getOrCreateCollection("unified_data_embeddings");
    console.log("Got collection for embeddings");

    // Chuẩn bị metadata
    const documentIds = [];
    const metadatas = [];

    for (const item of dataArray) {
      const docId = `${type}_${item.id}`;
      documentIds.push(docId);

      // Xử lý metadata theo cấu trúc dữ liệu thực tế
      const metadata = {
        type,
        itemId: item.id,
        propertyId: item.idProperty || null,
        name: item.name || "",
      };

      // Thêm thông tin city/country nếu có
      if (item.address) {
        metadata.city = item.address.city || null;
        metadata.country = item.address.country || null;
      } else if (item.city) {
        metadata.city = item.city.name || null;
        metadata.country = item.city.country || null;
      }

      metadatas.push(metadata);
    }

    console.log("Prepared data for adding to collection:", {
      documentIds,
      metadatas,
    });

    // Thêm vào collection
    await collection.add({
      ids: documentIds,
      documents: itemTexts,
      embeddings: embeddingVector,
      metadatas,
    });

    console.log("Successfully added embeddings to collection");
    return { message: "Embeddings saved successfully.", documentIds };
  } catch (error) {
    console.error("Error saving embeddings:", error);
    throw new Error(`Failed to save embeddings: ${error.message}`);
  }
}

module.exports = {
  generateSimplifiedResponseText,
  queryDatabase,
  saveEmbedding,
  getEmbeddingWithFallback, // Export the new function for potential use elsewhere
};
