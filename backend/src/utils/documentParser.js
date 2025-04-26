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
  };

  const lines = text.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("Khách sạn:")) {
      result.type = "hotel";
      result.name = line.replace("Khách sạn:", "").trim();
    } else if (line.startsWith("Phòng:")) {
      result.type = "room";
      result.name = line.replace("Phòng:", "").trim();
    }

    if (line.startsWith("ID khách sạn:")) {
      result.id = line.replace("ID khách sạn:", "").trim();
    } else if (line.startsWith("ID phòng:")) {
      result.id = line.replace("ID phòng:", "").trim();
    } else if (line.startsWith("Thuộc khách sạn có ID:")) {
      result.propertyId = line.replace("Thuộc khách sạn có ID:", "").trim();
    }

    if (line.startsWith("Mô tả:")) {
      result.description = line.replace("Mô tả:", "").trim();
    } else if (
      line.startsWith("- Đường:") ||
      line.startsWith("- Quận/Huyện:") ||
      line.startsWith("- Thành phố:") ||
      line.startsWith("- Quốc gia:")
    ) {
      result.address.push(line.trim());
    } else if (line.startsWith("Số người tối đa:")) {
      result.maxGuests = line.replace("Số người tối đa:", "").trim();
    } else if (line.startsWith("Giá:")) {
      result.price = line.replace("Giá:", "").trim();
    } else if (line.startsWith("Trạng thái:")) {
      result.status = line.replace("Trạng thái:", "").trim();
    }

    const imageMatch = line.match(/- \[\d+\] (https?:\/\/[^\s]+)/);
    if (imageMatch && imageMatch[1]) {
      result.images.push(imageMatch[1]);
    }
  });

  return result;
}

module.exports = { parseDocument, parseStringDocument };
