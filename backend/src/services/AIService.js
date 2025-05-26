const Groq = require("groq-sdk");
const fetch = require("node-fetch");
const { aiResponseCache } = require("./cacheService");

async function callGroqWithTimeout(prompt, timeoutMs = 3000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), timeoutMs);
  });

  try {
    if (aiResponseCache.has(prompt)) {
      return { response: aiResponseCache.get(prompt), source: "cache" };
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletionPromise = client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            'Bạn là một trợ lý du lịch thân thiện. Hãy trả lời câu hỏi bằng tiếng Việt, ngắn gọn, đúng trọng tâm, và thật tự nhiên (tối đa 2-3 câu). Nếu không có kết quả phù hợp, gợi ý lịch sự và tích cực. Tránh dùng từ như "không có thông tin" hay "không tìm thấy và bỏ qua các thuộc tính của hệ thống như id".',
        },
        { role: "user", content: prompt },
      ],
      model: "llama3-8b-8192",
      max_tokens: 150,
    });

    const chatCompletion = await Promise.race([
      chatCompletionPromise,
      timeoutPromise,
    ]);
    const response =
      chatCompletion.choices?.[0]?.message?.content ||
      "Hiện tại hệ thống bận, bạn thử lại ngay nhé!";
    aiResponseCache.set(prompt, response);
    return { response, source: "groq" };
  } catch (error) {
    console.error("Error in callGroqWithTimeout:", {
      message: error.message,
      stack: error.stack,
    });
    return {
      response: "Hiện tại hệ thống bận, bạn thử lại ngay nhé!",
      source: "groq",
      error: error.message,
    };
  }
}

async function callDeepSeekWithTimeout(
  prompt,
  previousQuery,
  timeoutMs = 5000
) {
  const controller = new AbortController();
  // const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // if (aiResponseCache.has(prompt)) {
    //   return { response: aiResponseCache.get(prompt), source: "cache" };
    // }

    // Tạo prompt với ngữ cảnh từ câu hỏi trước
    let fullPrompt = prompt;
    if (previousQuery) {
      fullPrompt = `Ngữ cảnh từ câu hỏi trước:\n- Câu hỏi: "${previousQuery.query}"\n- Câu trả lời: "${previousQuery.response}"\n\n${prompt}`;
    }

    const deepSeekResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          Referer: process.env.SITE_URL,
          "X-Title": process.env.SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick:free",
          messages: [
            {
              role: "system",
              content: fullPrompt,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 256,
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    );

    // clearTimeout(timeoutId);
    const data = await deepSeekResponse.json();
    const response =
      data?.choices?.[0]?.message?.content ||
      "Hiện tại hệ thống bận, bạn thử lại ngay nhé!";
    aiResponseCache.set(prompt, response);
    return { response, source: "deepseek" };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error in callDeepSeekWithTimeout:", {
      message: error.message,
      stack: error.stack,
    });
    return {
      response: "Hiện tại hệ thống bận, bạn thử lại ngay nhé!",
      source: "deepseek",
      error: error.message,
    };
  }
}

function selectBestResponse(groqResult, deepSeekResult, query) {
  // Kiểm tra nếu một trong hai kết quả hợp lệ
  if (groqResult?.response && !deepSeekResult?.response) {
    return groqResult.response;
  }
  if (deepSeekResult?.response && !groqResult?.response) {
    return deepSeekResult.response;
  }

  // Nếu cả hai đều không có response hợp lệ
  if (!groqResult?.response && !deepSeekResult?.response) {
    console.warn("Both Groq and DeepSeek responses are null or undefined");
    return "Hiện tại hệ thống bận, bạn thử lại ngay nhé!";
  }

  // So sánh độ dài và từ khóa
  const groqLength = groqResult.response?.length || 0;
  const deepSeekLength = deepSeekResult.response?.length || 0;
  const queryKeywords = query.toLowerCase().split(" ");

  const groqKeywordCount = queryKeywords.reduce(
    (count, keyword) =>
      count + (groqResult.response?.toLowerCase().includes(keyword) ? 1 : 0),
    0
  );
  const deepSeekKeywordCount = queryKeywords.reduce(
    (count, keyword) =>
      count +
      (deepSeekResult.response?.toLowerCase().includes(keyword) ? 1 : 0),
    0
  );

  if (groqKeywordCount > deepSeekKeywordCount) return groqResult.response;
  if (deepSeekKeywordCount > groqKeywordCount) return deepSeekResult.response;
  if (groqLength < deepSeekLength * 0.8) return groqResult.response;
  if (deepSeekLength < groqLength * 0.8) return deepSeekResult.response;

  return groqResult.response || deepSeekResult.response;
}

module.exports = {
  callGroqWithTimeout,
  callDeepSeekWithTimeout,
  selectBestResponse,
};
