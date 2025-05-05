const ratingText = (rating: number) => {
  if (rating == 0) {
    return "Chưa có đánh giá";
  } else if (rating <= 1) {
    return "Kém";
  } else if (rating <= 2) {
    return "Trung bình";
  } else if (rating <= 3) {
    return "Khá";
  } else if (rating <= 4) {
    return "Tốt";
  } else if (rating <= 5) {
    return "Hoàn hảo";
  }
};

const advertisingText = (advertising: number) => {
  if (advertising == 1) {
    return "Thường";
  } else if (advertising == 2) {
    return "Vip";
  } else {
    return "";
  }
};

export { ratingText, advertisingText };
