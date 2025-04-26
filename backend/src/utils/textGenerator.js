function generateText(item, type) {
  let text = "";
  if (type === "hotel" || type === "property") {
    text += `Khách sạn: ${item.name}\n`;
    text += `ID khách sạn: ${item.id}\n`;
    text += `Mô tả: ${item.description || "Không có mô tả"}\n`;
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
        item.images.map((img, i) => `- [${i + 1}] ${img.url}`).join("\n") +
        "\n";
    }
  } else if (type === "service") {
    text += `Dịch vụ: ${item.name}\n`;
    text += `ID dịch vụ: ${item.id}\n`;
    if (item.idProperty)
      text += `Được cung cấp bởi khách sạn có ID: ${item.idProperty}\n`;
    text += `Mô tả: ${item.description || "Không có mô tả"}\n`;
    text += `Giá: ${item.price || "Không xác định"} USD\n`;
  } else if (type === "review") {
    text += `Đánh giá về khách sạn: ${item.idProperty}\n`;
    text += `ID đánh giá: ${item.id}\n`;
    text += `Người đánh giá: ${item.idUser}\n`;
    text += `Điểm đánh giá: ${item.score || "Chưa có điểm"}\n`;
    text += `Nội dung: ${item.reviewContent || "Không có nội dung"}\n`;
  } else if (type === "category") {
    text += `Danh mục: ${item.name}\n`;
    text += `ID danh mục: ${item.id}\n`;
    text += `Mô tả: ${item.description || "Không có mô tả"}\n`;
  } else if (type === "vibe") {
    text += `Không khí: ${item.name}\n`;
    text += `ID không khí: ${item.id}\n`;
    text += `Mô tả: ${item.description || "Không có mô tả"}\n`;
  } else if (type === "amenity") {
    text += `Tiện nghi: ${item.name}\n`;
    text += `ID tiện nghi: ${item.id}\n`;
    text += `Biểu tượng: ${item.icon || "Không có biểu tượng"}\n`;
  } else if (type === "amenityRoom") {
    text += `Tiện nghi phòng: ID ${item.id}\n`;
    text += `ID phòng: ${item.idRoom}\n`;
    text += `ID tiện nghi: ${item.idAmenity}\n`;
    text += `Trạng thái: ${item.status || "Chưa xác định"}\n`;
  } else if (type === "amenityProperty") {
    text += `Tiện nghi khách sạn: ID ${item.id}\n`;
    text += `ID khách sạn: ${item.idProperty}\n`;
    text += `ID tiện nghi: ${item.idFacility}\n`;
    text += `Trạng thái: ${item.status || "Chưa xác định"}\n`;
  } else if (type === "imageRoom") {
    text += `Hình ảnh phòng: ID ${item.id}\n`;
    text += `ID phòng: ${item.idRoom}\n`;
    text += `Đường dẫn hình ảnh: ${item.image || "Không có đường dẫn"}\n`;
  } else if (type === "imageProperty") {
    text += `Hình ảnh khách sạn: ID ${item.id}\n`;
    text += `ID khách sạn: ${item.idProperty}\n`;
    text += `Đường dẫn hình ảnh: ${item.image || "Không có đường dẫn"}\n`;
  }
  return text.trim();
}

module.exports = { generateText };
