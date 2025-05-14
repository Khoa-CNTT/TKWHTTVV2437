function detectIntent(text) {
  const lowerText = text.toLowerCase();
  const intents = new Set(); // Sử dụng Set để tránh trùng lặp

  // Từ khóa cho từng loại intent
  const intentKeywords = {
    hotel: [
      "khách sạn",
      "chỗ ở",
      "nghỉ dưỡng",
      "nơi ở",
      "lưu trú",
      "resort",
      "đường đến",
      "di chuyển",
      "đi đến",
      "địa chỉ",
      
    ],
    room: [
      "phòng",
      "giá phòng",
      "đặt phòng",
      "giường",
      "suite",
      "loại phòng",
      "phòng trống",
      "phòng đôi",
      "phòng đơn",
    ],
    reviewPeroperty: [
      "khách sạn",
      "đánh giá",
      "review",
      "nhận xét",
      "đánh giá khách sạn",
      "nhận xét khách sạn",
    ],
  };

  // Kiểm tra từng loại intent
  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      intents.add(intent);
    }
  }

  // Nếu không tìm thấy intent nào, mặc định trả về "hotel"
  if (intents.size === 0) {
    intents.add("hotel");
  }

  // Chuyển Set thành mảng và trả về
  return Array.from(intents);
}

module.exports = { detectIntent };
