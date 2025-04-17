// services/embeddingService.js
const { HfInference } = require("@huggingface/inference");

const generateTextAuto = (item) => {
  return Object.entries(item)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (typeof value === "object") {
        return `${key}: ${JSON.stringify(value)}`;
      }
      return `${key}: ${value}`;
    })
    .join(", ");
};

async function queryEmbeddings(text) {
  const { fetchFullData } = require("./PropertyService");

  // B1: Phân loại ý định người dùng để lọc
  //   const classificationPrompt = `
  // Bạn là hệ thống lọc dữ liệu khách sạn. Hãy xác định người dùng đang quan tâm đến những tiêu chí nào dưới đây để hỗ trợ truy vấn dữ liệu:

  // Các tiêu chí có thể:
  // - "name": người dùng đề cập đến tên khách sạn, resort...
  // - "address": người dùng hỏi về vị trí, địa điểm, khu vực...
  // - "price": người dùng quan tâm đến giá phòng
  // - "amenities": người dùng hỏi về tiện nghi như hồ bơi, wifi, điều hòa...
  // - "services": người dùng hỏi về các dịch vụ như ăn sáng, spa, đưa đón...
  // - "availability": người dùng quan tâm đến phòng còn trống
  // - "reviews": người dùng hỏi về đánh giá, nhận xét

  // Câu hỏi: "${text}"

  // Trả lời bằng JSON array, ví dụ: ["name", "amenities", "price"]
  // `.trim();

  //   const classifyResponse = await fetch(
  //     "https://openrouter.ai/api/v1/chat/completions",
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  //         "HTTP-Referer": process.env.SITE_URL,
  //         "X-Title": process.env.SITE_NAME,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         model: "deepseek/deepseek-chat-v3-0324:free",
  //         messages: [{ role: "user", content: classificationPrompt }],
  //       }),
  //     }
  //   );

  //   const classifyData = await classifyResponse.json();
  //   let detectedTypes = classifyData.choices?.[0]?.message?.content?.trim();

  //   if (detectedTypes.startsWith("```")) {
  //     detectedTypes = detectedTypes
  //       .split("\n")
  //       .filter((line) => !line.startsWith("```"))
  //       .join("\n")
  //       .trim();
  //   }

  //   try {
  //     detectedTypes = JSON.parse(detectedTypes);
  //   } catch (err) {
  //     throw new Error("Invalid detectedTypes format");
  //   }

  //   // B2: Chuẩn bị điều kiện lọc
  //   const filterOptions = {};
  //   if (detectedTypes.includes("name")) {
  //     filterOptions.name = { $like: `%${text}%` };
  //   }
  //   if (detectedTypes.includes("address")) {
  //     filterOptions.address = { $like: `%${text}%` };
  //   }
  //   if (detectedTypes.includes("amenities")) {
  //     filterOptions.amenities = { some: { name: { $like: `%${text}%` } } };
  //   }
  // Bạn có thể thêm điều kiện khác tương tự như trên.

  // B3: Gọi fetchFullData có điều kiện lọc
  const fullData = await fetchFullData();

  // B4: Chuyển sang text để truyền vào LLM
  const contextText = fullData.map(generateTextAuto).join("\n\n");

  console.log("📄 contextText:", contextText);
  const finalPrompt = `
Bạn là một trợ lý đặt phòng khách sạn. Dựa trên dữ liệu sau, hãy trả lời câu hỏi của người dùng:

Thông tin khách sạn:
${contextText}

Câu hỏi người dùng:
"${text}"

Trả lời:
`.trim();

  // B5: Gửi lên LLM để trả lời
  const deepseekResponse = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL,
        "X-Title": process.env.SITE_NAME,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: finalPrompt }],
      }),
    }
  );

  const deepseekData = await deepseekResponse.json();

  return {
    response: deepseekData.choices[0].message.content,
  };
}

module.exports = {
  queryEmbeddings,
};
