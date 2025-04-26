// queryService.js
const { getOrCreateCollection } = require("./collectionService");
const { generateEmbedding } = require("./embeddingService");
const { contextCache, queryResultCache } = require("./cacheService");
const { detectIntent } = require("../utils/intentDetector");
const {
  parseDocument,
  parseStringDocument,
} = require("../utils/documentParser");

function generateSimplifiedResponseText(queryResult, previousContext = null) {
  const { query, matchedItems } = queryResult;
  let response = `Kết quả tìm kiếm cho: "${query}"\n\n`;

  let filteredItems = matchedItems;
  if (previousContext && previousContext.matchedItems) {
    const previousHotelIds = previousContext.matchedItems
      .filter((item) => item.metadata.type === "hotel")
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
      if (!document || !metadata) return;

      if (typeof document === "string") {
        const parsedDoc = parseStringDocument(document);

        if (metadata.type === "hotel" || parsedDoc.type === "hotel") {
          response += `${index + 1}. 🏨 ${
            metadata.name || parsedDoc.name || "Khách sạn"
          } (ID: ${metadata.itemId || parsedDoc.id})\n`;
          response += `   Mô tả: ${
            parsedDoc.description || "Không có mô tả"
          }\n`;
          response += `   Địa chỉ: ${parsedDoc.address.join(", ") || "N/A"}\n`;
          response += `   Đánh giá cặp đôi: ${
            metadata.rating || "Chưa có đánh giá"
          }\n`;
          response += `   Tiện ích: ${
            metadata.amenities || "Wifi miễn phí, hồ bơi, bãi đỗ xe"
          }\n`;

          if (parsedDoc.images && parsedDoc.images.length > 0) {
            response += `   Hình ảnh: ${parsedDoc.images.join(", ")}\n`;
          } else {
            response += `   Hình ảnh: Không có hình ảnh\n`;
          }
        } else if (metadata.type === "room" || parsedDoc.type === "room") {
          response += `${index + 1}. 🛏️ ${
            metadata.name || parsedDoc.name || "Phòng"
          } (Khách sạn ID: ${metadata.propertyId || parsedDoc.propertyId})\n`;
          response += `   Giá: ${parsedDoc.price || "N/A"}\n`;
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
          response += `   Địa chỉ: ${
            parsedDoc["Địa chỉ"] ? parsedDoc["Địa chỉ"].join(", ") : "N/A"
          }\n`;
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
    const embeddingVector = await generateEmbedding(text);
    const collection = await getOrCreateCollection("unified_data_embeddings");

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

    return matchedItems;
  } catch (error) {
    console.error("Error querying database:", error);
    throw new Error("Failed to query database: " + error.message);
  }
}

async function saveEmbedding(type, data) {
  const { generateText } = require("../utils/textGenerator");
  if (!data || (!Array.isArray(data) && (!data.id || !data.name))) {
    throw new Error("Dữ liệu không hợp lệ: Thiếu id hoặc name");
  }

  const itemTexts = Array.isArray(data)
    ? data.map((item) => generateText(item, type))
    : [generateText(data, type)];

  const embeddingVector = await generateEmbedding(itemTexts);
  const collection = await getOrCreateCollection("unified_data_embeddings");

  const documentIds = [];
  const metadatas = [];
  if (Array.isArray(data)) {
    for (const item of data) {
      if (!item.id || !item.name) {
        console.warn(`Dữ liệu không hợp lệ trong mảng:`, item);
        continue;
      }
      const docId = `${type}_${item.id}`;
      documentIds.push(docId);
      metadatas.push({
        type,
        itemId: item.id,
        propertyId: item.idProperty || null,
        name: item.name || "",
        city: item.city?.name || null,
        country: item.city?.country || null,
      });
    }
  } else {
    const docId = `${type}_${data.id}`;
    documentIds.push(docId);
    metadatas.push({
      type,
      itemId: data.id,
      propertyId: data.idProperty || null,
      name: data.name || "",
      city: data.city?.name || null,
      country: data.city?.country || null,
    });
  }

  await collection.add({
    ids: documentIds,
    documents: itemTexts,
    embeddings: embeddingVector,
    metadatas,
  });

  return { message: "Embeddings saved successfully.", documentIds };
}

module.exports = {
  generateSimplifiedResponseText,
  queryDatabase,
  saveEmbedding,
};
