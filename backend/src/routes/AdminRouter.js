const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authAdminMiddleware } = require("../middlewares/authMiddleware");

// Quản lý tài khoản
router.post("/login", adminController.loginAdmin); // Đăng nhập admin
router.post(
  "/register-owner",
  authAdminMiddleware,
  adminController.registerOwner
); // Đăng ký chủ Homestay/Resort
router.post("/create-user", authAdminMiddleware, adminController.createUser); // Tạo tài khoản người dùng
router.put("/update-user/:id", authAdminMiddleware, adminController.updateUser); // Cập nhật tài khoản người dùng
router.delete(
  "/delete-user/:id",
  authAdminMiddleware,
  adminController.deleteUser
); // Xóa tài khoản người dùng
router.get("/list-users", authAdminMiddleware, adminController.listUsers); // Xem danh sách người dùng
router.put(
  "/lock-account/:id",
  authAdminMiddleware,
  adminController.lockAccount
); // Khóa tài khoản

// Quản lý danh mục (Category)
router.post(
  "/create-category",
  authAdminMiddleware,
  adminController.createCategory
); // Tạo danh mục
router.put(
  "/update-category/:id",
  authAdminMiddleware,
  adminController.updateCategory
); // Cập nhật danh mục
router.delete(
  "/delete-category/:id",
  authAdminMiddleware,
  adminController.deleteCategory
); // Xóa danh mục
router.get(
  "/list-categories",
  authAdminMiddleware,
  adminController.listCategories
); // Xem danh sách danh mục

// Quản lý địa điểm (Location)
router.post(
  "/create-location",
  authAdminMiddleware,
  adminController.createLocation
); // Tạo địa điểm
router.put(
  "/update-location/:id",
  authAdminMiddleware,
  adminController.updateLocation
); // Cập nhật địa điểm
router.delete(
  "/delete-location/:id",
  authAdminMiddleware,
  adminController.deleteLocation
); // Xóa địa điểm
router.get(
  "/list-locations",
  authAdminMiddleware,
  adminController.listLocations
); // Xem danh sách địa điểm

// Quản lý tiện ích (Amenity)
router.post(
  "/create-amenity",
  authAdminMiddleware,
  adminController.createAmenity
); // Tạo tiện ích
router.put(
  "/update-amenity/:id",
  authAdminMiddleware,
  adminController.updateAmenity
); // Cập nhật tiện ích
router.delete(
  "/delete-amenity/:id",
  authAdminMiddleware,
  adminController.deleteAmenity
); // Xóa tiện ích
router.get(
  "/list-amenities",
  authAdminMiddleware,
  adminController.listAmenities
); // Xem danh sách tiện ích

// Quản lý Homestay/Resort
router.put(
  "/update-homestay/:id",
  authAdminMiddleware,
  adminController.updateHomestay
); // Cập nhật Homestay/Resort
router.get(
  "/list-homestays",
  authAdminMiddleware,
  adminController.listHomestays
); // Xem danh sách Homestay/Resort
router.put(
  "/approve-homestay/:id",
  authAdminMiddleware,
  adminController.approveHomestay
); // Phê duyệt Homestay/Resort
router.put(
  "/reject-homestay/:id",
  authAdminMiddleware,
  adminController.rejectHomestay
); // Từ chối Homestay/Resort

// Quản lý đơn đặt
router.get("/list-bookings", authAdminMiddleware, adminController.listBookings); // Xem danh sách đơn đặt
router.put(
  "/confirm-booking/:id",
  authAdminMiddleware,
  adminController.confirmBooking
); // Xác nhận đơn đặt
router.put(
  "/cancel-booking/:id",
  authAdminMiddleware,
  adminController.cancelBooking
); // Hủy đơn đặt

// Quản lý thanh toán
router.get("/list-payments", authAdminMiddleware, adminController.listPayments); // Xem danh sách thanh toán
router.put(
  "/refund-payment/:id",
  authAdminMiddleware,
  adminController.refundPayment
); // Hoàn tiền

module.exports = router;
