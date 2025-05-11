function generateText(item, type) {
  let text = "";
  if (type === "hotel" || type === "property") {
    text += `Khách sạn: ${item.name}\n`;
    text += `ID khách sạn: ${item.id}\n`;
    text += `Mô tả: ${item.description || "Không có mô tả"}\n`;
    text += `Trạng thái: ${item.status || "Không xác định"}\n`;
    text += `Link: ${item.link}\n`;
    if (item.address && typeof item.address === "object") {
      const addr = item.address;
      text += `Địa chỉ:\n`;
      text += `- Đường: ${addr.street || "Không có"}\n`;
      text += `- Quận/Huyện: ${addr.district || "Không có"}\n`;
      text += `- Thành phố: ${addr.city || "Không có"}\n`;
      text += `- Quốc gia: ${addr.country || "Không có"}\n`;
    } else {
      text += `Địa chỉ: Không có thông tin chi tiết\n`;
    }
    if (item.city)
      text += `Thành phố: ${item.city.name}, Quốc gia: ${item.city.country}\n`;
    if (item.images && item.images.length > 0) {
      text += `Hình ảnh (${item.images.length}):\n`;
      text +=
        item.images.map((img, i) => `- [${i + 1}] ${img.image}`).join("\n") +
        "\n";
    }
    if (item.amenities && item.amenities.length > 0) {
      text += `Tiện nghi: ${item.amenities.map((a) => a.name).join(", ")}\n`;
    }
  } else if (type === "room") {
    text += `Phòng: ${item.name}\n`;
    text += `ID phòng: ${item.id}\n`;
    text += `Thuộc khách sạn có ID: ${item.idProperty}\n`;
    text += `Mô tả: ${item.description || "Không có mô tả"}\n`;
    text += `Số người tối đa: ${item.maxPerson || "Không xác định"}\n`;
    text += `Giá: ${item.price || "Không xác định"} USD\n`;
    text += `Trạng thái: ${item.status || "Không xác định"}\n`;
    if (item.amenities && item.amenities.length > 0)
      text += `Tiện nghi: ${item.amenities.map((a) => a.name).join(", ")}\n`;
    if (item.images && item.images.length > 0) {
      text += `Hình ảnh (${item.images.length}):\n`;
      text +=
        item.images.map((img, i) => `- [${i + 1}] ${img.image}`).join("\n") +
        "\n";
    }
    if (item.summaries && item.summaries.length > 0) {
      text += `Tóm tắt: ${item.summaries.map((s) => s.name).join(", ")}\n`;
    }
  } else if (type === "reviewPeroperty") {
    text += `Điểm đánh giá của: ${item.id}`;
    text += `ID khách sạn: ${item.propertyId}\n`;
    text += `Khách sạn: ${item.name}\n`;
    text += `Điểm đánh giá: ${item.averageRating || "Chưa có điểm"}\n`;
  }
  return text.trim();
}

module.exports = { generateText };
