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
    address: null,
    maxGuests: null,
    price: null,
    status: null,
    images: [],
    averageRating: null,
    property: null,
    link: null,
  };

  const lines = text.split("\n");
  let isAddressSection = false;
  let addressObj = {
    street: null,
    district: null,
    city: null,
    country: null,
  };

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

    // Handle link
    if (line.startsWith("Link:")) {
      result.link = line.replace("Link:", "").trim();
    }

    // Handle address
    if (line.trim() === "Địa chỉ:") {
      isAddressSection = true;
      return;
    }

    if (isAddressSection && line.trim().startsWith("-")) {
      const addressLine = line.trim().replace("-", "").trim();
      if (addressLine.startsWith("Đường:")) {
        addressObj.street = addressLine.replace("Đường:", "").trim();
      } else if (addressLine.startsWith("Quận/Huyện:")) {
        addressObj.district = addressLine.replace("Quận/Huyện:", "").trim();
      } else if (addressLine.startsWith("Thành phố:")) {
        addressObj.city = addressLine.replace("Thành phố:", "").trim();
      } else if (addressLine.startsWith("Quốc gia:")) {
        addressObj.country = addressLine.replace("Quốc gia:", "").trim();
      }
    } else if (isAddressSection && line.trim() !== "") {
      isAddressSection = false;
      if (Object.values(addressObj).some((value) => value !== null)) {
        result.address = addressObj;
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

    // Handle max guests
    if (line.startsWith("Số người tối đa:")) {
      result.maxGuests = parseInt(line.replace("Số người tối đa:", "").trim());
    }

    // Handle price
    if (line.startsWith("Giá:")) {
      const priceStr = line.replace("Giá:", "").trim();
      result.price = priceStr;
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

  // Final check for address if we're still in address section
  if (
    isAddressSection &&
    Object.values(addressObj).some((value) => value !== null)
  ) {
    result.address = addressObj;
  }

  return result;
}

module.exports = { parseDocument, parseStringDocument };
