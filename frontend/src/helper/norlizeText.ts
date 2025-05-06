export const normalizeText = (str: string): string => {
  return str
    .normalize("NFD") // Chuẩn hóa chuỗi thành dạng tổ hợp ký tự
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
    .toLowerCase(); // Chuyển thành chữ thường
};
