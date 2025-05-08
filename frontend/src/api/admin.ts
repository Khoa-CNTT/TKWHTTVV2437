import http from "@/libs/http";
import dayjs from "dayjs";
import { get } from "http";
export interface StatisticsData {
  date: string;
  userCount: number;
  ownerCount: number;
  reservationCount: number;
  
}
type TimeFilter = 'day' | 'month' | 'year';

const apisAdmin = {
  // ========================= Quản lý tài khoản =========================
  loginAdmin: (data: { email: string; password: string }) =>
    http.post(`admin/login`, data),

  // ========================= Quản lý chủ sở hữu =========================


  // ========================= Quản lý người dùng =========================
  listUsers: () =>
    http.get(`admin/list-users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }),

  createUser: async (data: {
    email: string;
    password: string;
    phone: string;
    avatar: string;
    firstName: string;
    lastName: string;
    bio: string;
    gender: string;
    dateOfBirth: Date;
    emergencyPhone: string;
    address: string;
    role: string;
    status: string;
  }) => {
    try {
      return await http.post(`admin/create-user`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      throw error; // Ném lỗi để frontend xử lý
    }
  },

  updateUser: (id: string, data: {
    email: string;
    password: string;
    phone: string;
    avatar: string;
    firstName: string;
    lastName: string;
    bio: string;
    gender: string;
    dateOfBirth: Date;
    emergencyPhone: string;
    address: string;
    role: string;
    status: string;
  }) =>
    http.put(`admin/update-user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }),

  deleteUser: (id: string) =>
    http.delete(`admin/delete-user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }),

  lockAccount: (id: string) => http.put(`admin/lock-account/${id}`, {}),
  approveOwner: (id: string) => http.put(`admin/approve-owner/${id}`, {}),


  // ========================= Quản lý danh mục (Category) =========================
  // createCategory: (data: any) => http.post(`admin/create-category`, data),

  // updateCategory: (id: string, data: any) =>
  //   http.put(`admin/update-category/${id}`, data),

  // deleteCategory: (id: string) => http.delete(`admin/delete-category/${id}`),

  listCategories: () => http.get(`admin/list-categories`),

  // ========================= Quản lý địa điểm (Location) =========================
  // createLocation: (data: any) => http.post(`admin/create-location`, data),

  // updateLocation: (id: string, data: any) =>
  //   http.put(`admin/update-location/${id}`, data),

  // deleteLocation: (id: string) => http.delete(`admin/delete-location/${id}`),

  listLocations: () => http.get(`admin/list-locations`),

  // // ========================= Quản lý tiện ích (Amenity) =========================
  // createAmenity: (data: any) => http.post(`admin/create-amenity`, data),

  // updateAmenity: (id: string, data: any) =>
  //   http.put(`admin/update-amenity/${id}`, data),

  // deleteAmenity: (id: string) => http.delete(`admin/delete-amenity/${id}`),

  listAmenities: () => http.get(`admin/list-amenities`),

  // ========================= Quản lý homestay =========================
 

  updateHomestay: (
    id: string,
    data: {
      name: string;
      description: string;
      status: string;
      idCategory: string;
      idAddress: string;
      images: string[]; 
    }
  ) => http.put(`admin/update-homestay/${id}`, data),
  
  listHomestays: () => http.get(`admin/list-homestays`),

  deleteHomestay: (id: string) =>
    http.delete(`admin/delete-homestay/${id}`, {}),
  // ========================= Quản lý phòng (Room) =========================
  listRooms: (propertyId: string) =>
    http.get(`admin/list-room/${propertyId}`),
  listProperties: (ownerId:string) => 
    http.get(`admin/list-properties/${ownerId}`),
  updateRoom: (
    id: string,
    data: {
      name: string;
      description: string;
      maxPerson: number;
      price: number;
      status: string; 
      idProperty: string;
      images: string[]; 
      amenities: string[]; 
    }
  ) => http.put(`admin/update-room/${id}`, data),
  
  deleteRoom: (id: string) => http.delete(`admin/delete-room/${id}`),

  // ========================= Quản lý thanh toán (Payment) =========================
  listPayments: () => http.get(`admin/list-payments`),

  refundPayment: (id: string) => http.put(`admin/refund-payment/${id}`, {}),

  // ========================= Quản lý đặt phòng (Booking) =========================
  listBookings: () => http.get(`admin/list-bookings`),

  confirmBooking: (id: string) => http.put(`admin/confirm-booking/${id}`, {}),

  cancelBooking: (id: string) => http.put(`admin/cancel-booking/${id}`, {}),


  // getStatistics: (filter: TimeFilter) => 
  //   http.get<{ data: StatisticsData[] }>(`/admin/statistics`, {
  //     params: { filter },
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //     },
  //   }),
};

export default apisAdmin;