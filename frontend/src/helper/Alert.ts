import Swal from "sweetalert2";

// Thông báo thành công
export const showSuccessAlert = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Thành công",
    text: message,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
  });
};

// Thông báo lỗi
export const showErrorAlert = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Lỗi",
    text: message,
    confirmButtonColor: "#d33",
    confirmButtonText: "OK",
  });
};

// Xác nhận hành động
export const showConfirmAlert = async (message: string) => {
  const result = await Swal.fire({
    title: "Xác nhận",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy",
  });
  return result.isConfirmed;
};