const ratingText = (rating: number) => {
  if (rating <= 1) {
    return "Kém";
  } else if (rating <= 2) {
    return "Tệ";
  } else if (rating <= 3) {
    return "Trung bình";
  } else if (rating <= 4) {
    return "Khá";
  } else if (rating <= 5) {
    return "Tốt";
  } else if (rating <= 6) {
    return "Hài lòng";
  } else if (rating <= 7) {
    return "Hài lòng";
  } else if (rating <= 8) {
    return "Xuất sắc";
  } else if (rating <= 9) {
    return "Tuyệt vời";
  } else if (rating <= 10) {
    return "Hoàn hảo";
  }
};

export { ratingText };
