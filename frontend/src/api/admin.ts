import http from "@/libs/http";

const apisAdmin = {
  // Đăng nhập admin
  loginAdmin: (data: { email: string; password: string }) =>
    http.post(`admin/login`, data),

  // Quản lý chủ sở hữu
  registerOwner: (data: any) => http.post(`admin/register-owner`, data),

  // Quản lý người dùng
    listUsers: () =>
      http.get(`admin/list-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
  
    // Tạo user mới
    createUser: (data: any) =>
      http.post(`admin/create-user`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
  
    // Cập nhật thông tin user
    updateUser: (id: string, data: any) =>
      http.put(`admin/update-user/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
  
    // Xóa user
    deleteUser: (id: string) =>
      http.delete(`admin/delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
  

  lockAccount: (id: string) => http.put(`admin/lock-account/${id}`,{}),

  // Quản lý danh mục
  createCategory: (data: any) => http.post(`admin/create-category`, data),

  updateCategory: (id: string, data: any) =>
    http.put(`admin/update-category/${id}`, data),

  deleteCategory: (id: string) => http.delete(`admin/delete-category/${id}`),

  listCategories: () => http.get(`admin/list-categories`),

  // Quản lý địa điểm
  createLocation: (data: any) => http.post(`admin/create-location`, data),

  updateLocation: (id: string, data: any) =>
    http.put(`admin/update-location/${id}`, data),

  deleteLocation: (id: string) => http.delete(`admin/delete-location/${id}`),

  listLocations: () => http.get(`admin/list-locations`),

  // Quản lý tiện ích
  createAmenity: (data: any) => http.post(`admin/create-amenity`, data),

  updateAmenity: (id: string, data: any) =>
    http.put(`admin/update-amenity/${id}`, data),

  deleteAmenity: (id: string) => http.delete(`admin/delete-amenity/${id}`),

  listAmenities: () => http.get(`admin/list-amenities`),

  // Quản lý homestay
  approveHomestay: (id: string) => http.put(`admin/approve-homestay/${id}`,{}),

  rejectHomestay: (id: string) => http.put(`admin/reject-homestay/${id}`,{}),

  updateHomestay: (id: string, data: any) =>
    http.put(`admin/update-homestay/${id}`, data),

  listHomestays: () => http.get(`admin/list-homestays`),

  // Quản lý thanh toán
  listPayments: () => http.get(`admin/list-payments`),

  refundPayment: (id: string) => http.put(`admin/refund-payment/${id}`,{}),

  // Quản lý đặt phòng
  listBookings: () => http.get(`admin/list-bookings`),

  confirmBooking: (id: string) => http.put(`admin/confirm-booking/${id}`,{}),

  cancelBooking: (id: string) => http.put(`admin/cancel-booking/${id}`,{}),
};

export default apisAdmin;