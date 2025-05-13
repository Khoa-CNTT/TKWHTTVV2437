// QueryController.js
const {
  queryDatabase,
  generateSimplifiedResponseText,
  saveEmbedding,
} = require("../services/queryService");
const { contextCache, queryResultCache } = require("../services/cacheService");
const { detectIntent } = require("../utils/intentDetector");
const {
  callGroqWithTimeout,
  callDeepSeekWithTimeout,
  selectBestResponse,
} = require("../services/AIService");
const {
  getOrCreateCollection,
  deleteAllCollections,
  deleteAllDocuments,
} = require("../services/collectionService");

class QueryController {
  async query(req, res) {
    const { text, limit = 5 } = req.query;
    let sessionId = req.headers["x-session-id"] || req.query.sessionId;
    const startTime = Date.now();

    if (!text) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: text" });
    }

    try {
      const cacheKey = `full_${text}_${limit}`;
      if (queryResultCache.has(cacheKey)) {
        const cachedResult = queryResultCache.get(cacheKey);
        cachedResult.fromCache = true;
        cachedResult.queryTimeMs = Date.now() - startTime;
        return res.status(200).json(cachedResult);
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Transfer-Encoding": "chunked",
        "x-session-id": sessionId, // Gửi sessionId trong header
      });

      let context = contextCache.get(sessionId) || { history: [] };
      const previousQuery =
        context.history.length > 0
          ? context.history[context.history.length - 1]
          : null;

      // Phát hiện intent
      const intents = detectIntent(text);

      let matchedItems = [];
      try {
        matchedItems = await queryDatabase(text, limit, intents);
      } catch (dbError) {
        console.error("Error querying database:", dbError);
        // Continue with empty results instead of failing completely
      }

      const queryResult = {
        query: text,
        matchedItems,
        relatedHotels: matchedItems
          .filter((e) => e.metadata.type === "hotel")
          .slice(0, 5),
        relatedRooms: matchedItems
          .filter((e) => e.metadata.type === "room")
          .slice(0, 5),
        reviewPeroperty: matchedItems
          .filter((e) => e.metadata.type === "reviewPeroperty")
          .slice(0, 5),
      };

      console.log("Query result:", queryResult);

      const initialResult = {
        // query: text,
        // matchedItems: matchedItems.slice(0, 3),
        // simpleResponse: generateSimplifiedResponseText(
        //   queryResult,
        //   previousQuery
        // ),
        processingTimeMs: Date.now() - startTime,
      };
      // res.write(JSON.stringify(initialResult));

      const responseText = generateSimplifiedResponseText(
        queryResult,
        previousQuery
      );

      console.log("Response text:", responseText);

      // Tạo prompt với tất cả intents
      let prompt = `Bạn là một trợ lý du lịch thân thiện. Dựa trên câu hỏi hiện tại: "${text}", và thông tin từ cơ sở dữ liệu (lọc theo các loại: ${intents.join(
        ", "
      )}):\n\n${responseText}\n\n`;

      if (previousQuery) {
        console.log("Previous query:", previousQuery);
        prompt += `Ngữ cảnh từ câu hỏi trước:\n- Câu hỏi: "${previousQuery.query}"\n- Câu trả lời: "${previousQuery.response}"\n\n`;
      }

      prompt += `Vui lòng trả lời bằng tiếng Việt, ngắn gọn (tối đa 2-3 câu), đúng trọng tâm và tự nhiên.Nếu có trạng thái của khách sạn, hãy đưa ra thông tin về trạng thái đó. Nếu có thông tin, hãy phản hồi các thuộc tính liên quan như địa điểm, tiện nghi, giá, v.v.Đưa ra các url như hình ảnh , hoặc đường dẫn đến trang web nếu có . Nếu không có kết quả phù hợp, hãy đưa ra một gợi ý tích cực và lịch sự.Tránh sử dụng các cụm như "không có thông tin" hay "không tìm thấy" . \n\nCâu trả lời:`;

      const [groqResult, deepSeekResult] = await Promise.all([
        callDeepSeekWithTimeout(prompt, 3000).catch((err) => ({
          response: null,
          source: "deepseek",
          error: err.message,
        })),
        callGroqWithTimeout(prompt, 3000).catch((err) => ({
          response: null,
          source: "groq",
          error: err.message,
        })),
      ]);

      const aiResponse = selectBestResponse(groqResult, deepSeekResult, text);
      const responseSource = groqResult.response
        ? groqResult.source
        : deepSeekResult.source;

      context.history.push({
        query: text,
        response: aiResponse,
        matchedItems: matchedItems.slice(0, 5),
        intents, // Lưu tất cả intents
      });
      if (context.history.length > 5) {
        context.history.shift();
      }
      contextCache.set(sessionId, context);

      const finalResult = {
        answer: aiResponse || "Hiện tại hệ thống bận, bạn thử lại ngay nhé!",
      };

      queryResultCache.set(cacheKey, finalResult);
      res.write(JSON.stringify(finalResult));
      res.end();
    } catch (error) {
      console.error("Error during query:", error);
      const fallbackPrompt = `Bạn là một trợ lý du lịch thân thiện. Câu hỏi của khách hàng là "${text}". Hệ thống gặp lỗi khi tìm kiếm, nhưng hãy trả lời ngắn gọn, tự nhiên và lịch sự bằng tiếng Việt, gợi ý tích cực hoặc giải pháp thay thế. Tối đa 2-3 câu. Tránh dùng từ như "không có thông tin" hay "không tìm thấy".\n\nCâu trả lời:`;

      try {
        const [groqResult, deepSeekResult] = await Promise.all([
          callGroqWithTimeout(fallbackPrompt, 3000).catch((err) => ({
            response: null,
            source: "groq",
            error: err.message,
          })),
          callDeepSeekWithTimeout(fallbackPrompt, 3000).catch((err) => ({
            response: null,
            source: "deepseek",
            error: err.message,
          })),
        ]);

        const fallbackResponse = selectBestResponse(
          groqResult,
          deepSeekResult,
          text
        );
        const responseSource = groqResult.response
          ? groqResult.source
          : deepSeekResult.source;

        const errorResponse = {
          status: "error",
          query: text,
          answer: fallbackResponse || "Hệ thống bận, bạn thử lại ngay nhé!",
          responseSource,
          queryTimeMs: Date.now() - startTime,
        };
        res.write(JSON.stringify(errorResponse));
      } catch (aiError) {
        const errorResponse = {
          status: "error",
          error: "Query failed",
          details: error.message,
          queryTimeMs: Date.now() - startTime,
        };
        res.write(JSON.stringify(errorResponse));
      }
      res.end();
    }
  }

  async quickQuery(req, res) {
    const { text, limit = 5 } = req.query;
    const startTime = Date.now();

    if (!text) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: text" });
    }

    try {
      const cacheKey = `quick_${text}_${limit}`;
      if (queryResultCache.has(cacheKey)) {
        const cachedResult = queryResultCache.get(cacheKey);
        cachedResult.fromCache = true;
        cachedResult.queryTimeMs = Date.now() - startTime;
        return res.status(200).json(cachedResult);
      }

      const intents = detectIntent(text);
      const matchedItems = await queryDatabase(text, limit, intents);

      const queryResult = {
        query: text,
        matchedItems,
        queryTimeMs: Date.now() - startTime,
      };

      queryResultCache.set(cacheKey, queryResult);
      res.status(200).json(queryResult);
    } catch (error) {
      console.error("Error during quick query:", error);
      res
        .status(500)
        .json({ error: "Quick query failed", details: error.message });
    }
  }

  async saveEmbeddings(req, res) {
    const { type, data } = req.body;

    try {
      const result = await saveEmbedding(type, data);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error generating embedding or saving to ChromaDB:", error);
      res.status(500).json({
        error: "Error generating embedding or saving to ChromaDB.",
        details: error.message,
      });
    }
  }

  async askDeepSeek(req, res) {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    try {
      const { response } = await callDeepSeekWithTimeout(question, 3000);
      res.status(200).json({ answer: response });
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      res
        .status(500)
        .json({ error: "Error calling DeepSeek API", details: error.message });
    }
  }

  async getDocuments(req, res) {
    try {
      const collection = await getOrCreateCollection("unified_data_embeddings");
      const allDocuments = await collection.get();
      res.status(200).json(allDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res
        .status(500)
        .json({ error: "Error fetching documents", details: error.message });
    }
  }

  async deleteDocument(req, res) {
    const { id } = req.params;

    try {
      const collection = await getOrCreateCollection("unified_data_embeddings");
      await collection.delete({ ids: [id] });
      res.status(200).json({ message: `Document ${id} deleted successfully` });
    } catch (error) {
      console.error("Error deleting document:", error);
      res
        .status(500)
        .json({ error: "Error deleting document", details: error.message });
    }
  }

  async deleteCollections(req, res) {
    try {
      const result = await deleteAllCollections();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting collections:", error);
      res
        .status(500)
        .json({ error: "Error deleting collections", details: error.message });
    }
  }

  async deleteAllDocuments(req, res) {
    try {
      const result = await deleteAllDocuments();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting documents:", error);
      res
        .status(500)
        .json({ error: "Error deleting documents", details: error.message });
    }
  }

  async status(req, res) {
    const {
      embeddingCache,
      queryResultCache,
      aiResponseCache,
      contextCache,
    } = require("../services/cacheService");

    console.log(
      `Cache stats: embeddingCache=${embeddingCache.size}, queryResultCache=${queryResultCache.size}, aiResponseCache=${aiResponseCache.size}, contextCache=${contextCache.size}`
    );
    res.status(200).json({
      message: "Server is running",
      cacheStats: {
        embeddingCacheSize: embeddingCache.size,
        queryResultCacheSize: queryResultCache.size,
        aiResponseCacheSize: aiResponseCache.size,
        contextCacheSize: contextCache.size,
      },
    });
  }

  async clearCache(req, res) {
    const { clearAllCaches } = require("../services/cacheService");
    clearAllCaches();
    res.status(200).json({ message: "All caches cleared successfully" });
  }
}

module.exports = new QueryController();
