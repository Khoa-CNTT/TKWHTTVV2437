function parseDocument(text) {
  const sections = {};
  let currentSection = null;
  const lines = text.split("\n");

  for (const line of lines) {
    if (line.trim().match(/^[^\-].*:$/)) {
      currentSection = line.trim().slice(0, -1);
      sections[currentSection] = [];
    } else if (currentSection) {
      sections[currentSection].push(line.trim());
    }
  }

  for (const key in sections) {
    sections[key] = sections[key].filter((line) => line.length > 0);
  }

  return sections;
}

function parseStringDocument(text) {
  const result = {
    type: null,
    name: null,
    id: null,
    propertyId: null,
    description: null,
    address: [],
    maxGuests: null,
    price: null,
    status: null,
    images: [],
    averageRating: null,
    property: null,
  };

  const lines = text.split("\n");

  console.log(lines, "lines lalalalalal");

  lines.forEach((line) => {
    // Handle hotel name and ID
    const hotelMatch = line.match(/🏨\s*(.*?)\s*\(ID:\s*(.*?)\)/);
    if (hotelMatch) {
      result.type = "hotel";
      result.name = hotelMatch[1].trim();
      result.id = hotelMatch[2].trim();
    }

    // Handle description
    if (line.startsWith("Mô tả:")) {
      result.description = line.replace("Mô tả:", "").trim();
    }

    // Handle address
    if (line.startsWith("Địa chỉ:")) {
      const address = line.replace("Địa chỉ:", "").trim();
      if (address !== "N/A") {
        result.address.push(address);
      }
    }

    // Handle amenities
    if (line.startsWith("Tiện ích:")) {
      const amenities = line.replace("Tiện ích:", "").trim();
      if (amenities !== "N/A") {
        result.amenities = amenities.split(", ").map((item) => item.trim());
      }
    }

    // Handle images
    if (line.startsWith("Hình ảnh:")) {
      const images = line.replace("Hình ảnh:", "").trim();
      if (images !== "Không có hình ảnh") {
        result.images = images.split(", ").map((item) => item.trim());
      }
    }

    // Handle status
    if (line.startsWith("Trạng thái:")) {
      result.status = line.replace("Trạng thái:", "").trim();
    }

    // Handle rating
    if (line.startsWith("Điểm đánh giá:")) {
      result.averageRating = line.replace("Điểm đánh giá:", "").trim();
    } else if (line.startsWith("Điểm đánh giá của")) {
      const ratingMatch = line.match(/Điểm đánh giá của:.*?(\d+\.?\d*)/);
      if (ratingMatch && ratingMatch[1]) {
        result.averageRating = ratingMatch[1];
      }
    }

    // Handle room name
    if (line.startsWith("Phòng:")) {
      result.name = line.replace("Phòng:", "").trim();
    }

    // Handle room ID
    if (line.startsWith("ID phòng:")) {
      result.id = line.replace("ID phòng:", "").trim();
    }

    // Handle hotel name
    if (line.startsWith("Thuộc khách sạn :")) {
      result.property = line.replace("Thuộc khách sạn :", "").trim();
    }

    // Handle description
    if (line.startsWith("Mô tả:")) {
      result.description = line.replace("Mô tả:", "").trim();
    }

    // Handle max guests
    if (line.startsWith("Số người tối đa:")) {
      result.maxGuests = parseInt(line.replace("Số người tối đa:", "").trim());
    }

    // Handle price
    if (line.startsWith("Giá:")) {
      const priceStr = line.replace("Giá:", "").trim();
      result.price = priceStr;
    }

    // Handle status
    if (line.startsWith("Trạng thái:")) {
      result.status = line.replace("Trạng thái:", "").trim();
    }

    // Handle amenities
    if (line.startsWith("Tiện nghi:")) {
      const amenities = line.replace("Tiện nghi:", "").trim();
      if (amenities !== "N/A") {
        result.amenities = amenities.split(", ").map((item) => item.trim());
      }
    }

    if (line.trim().startsWith("- [")) {
      const imageUrl = line.split("] ")[1]?.trim();
      if (imageUrl) {
        result.images.push(imageUrl);
      }
    }

    // Handle summary
    if (line.startsWith("Tóm tắt:")) {
      result.summary = line.replace("Tóm tắt:", "").trim();
    }
  });

  return result;
}

module.exports = { parseDocument, parseStringDocument };
