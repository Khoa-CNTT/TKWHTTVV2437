"use client";
import React, { useState, useEffect } from "react";
import apisAdmin from "@/api/admin";
import dayjs from "dayjs";
import "font-awesome/css/font-awesome.min.css";

import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
} from "@/helper/Alert";

interface IReservation {
  id: string;
  idUser: string;
  idRoom: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIndate: string;
  checkOutdate: string;
  numGuest: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  User?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  Room?: {
    roomNumber: string;
  };
}

const ManageReservationContainer: React.FC = () => {
  // const router = useRouter();\

  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<IReservation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof IReservation>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dateFilter, setDateFilter] = useState<{
    type: "checkIn" | "checkOut" | "createdAt" | "";
    value: string;
  }>({ type: "", value: "" });
  const rowsPerPage = 10;

  // Xử lý sắp xếp
  const handleSort = (field: keyof IReservation) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Lọc và sắp xếp dữ liệu
  const filteredReservations = reservations
    .filter((reservation) => {
      // Điều kiện tìm kiếm text
      const matchesSearch =
        `${reservation.firstName} ${reservation.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone.includes(searchTerm);

      // Điều kiện trạng thái
      const matchesStatus =
        filterStatus === "all" || reservation.status === filterStatus;

      // Điều kiện ngày
      let matchesDate = true;
      if (dateFilter.type && dateFilter.value) {
        const reservationDate = dayjs(
          dateFilter.type === "checkIn"
            ? reservation.checkIndate
            : dateFilter.type === "checkOut"
              ? reservation.checkOutdate
              : reservation.createdAt
        ).format("YYYY-MM-DD");

        matchesDate = reservationDate === dateFilter.value;
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const getValue = (item: IReservation) => {
        const value = item[sortField];

        // Xử lý đặc biệt cho các trường ngày
        if (["checkIndate", "checkOutdate", "createdAt"].includes(sortField)) {
          // Thêm kiểm tra kiểu và ép kiểu
          if (typeof value === "string") {
            return dayjs(value as string).valueOf();
          }
          return 0; // Hoặc giá trị mặc định nếu không phải string
        }

        return typeof value === "string" ? value.toLowerCase() : value;
      };

      const valueA = getValue(a);
      const valueB = getValue(b);

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Xử lý trường hợp timestamp (number)
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReservations.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(filteredReservations.length / rowsPerPage);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await apisAdmin.listBookings();
      const reservationsWithUser: IReservation[] = response.data.map(
        (res: IReservation) => ({
          ...res,
          firstName: res.User?.firstName || res.firstName,
          lastName: res.User?.lastName || res.lastName,
          email: res.User?.email || res.email,
          phone: res.User?.phone || res.phone,
        })
      );
      setReservations(reservationsWithUser);
    } catch (err) {
      console.error("Error loading reservations:", err);
      setError("Không thể tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewDetail = (reservation: IReservation) => {
    setSelectedReservation(reservation); // Mở modal bằng cách set reservation được chọn
  };

  const handleCancel = async (id: string) => {
    const confirm = await showConfirmAlert(
      "Bạn chắc chắn muốn hủy đặt phòng này?"
    );
    if (confirm) {
      try {
        await apisAdmin.cancelBooking(id);
        fetchReservations();
        showSuccessAlert("Hủy đặt phòng thành công!");
      } catch (error) {
        showErrorAlert("Hủy đặt phòng thất bại!");
      }
    }
  };
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };
  useEffect(() => {
    fetchReservations();
  }, []);

  const ReservationDetailModal: React.FC<{
    reservation: IReservation;
    onClose: () => void;
  }> = ({ reservation, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fa fa-calendar text-blue-600"></i>
            Chi tiết đặt phòng
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i className="fa fa-times text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột trái */}
          <div className="space-y-4">
            <DetailItem
              label="Khách hàng"
              value={
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-user text-yellow-500 w-4"></i>
                    {reservation.firstName} {reservation.lastName}
                  </div>
                </div>
              }
            />
            <DetailItem
              label="Liên hệ"
              value={
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-phone text-gray-500 w-4"></i>
                    {reservation.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa fa-envelope text-gray-500 w-4"></i>
                    {reservation.email}
                  </div>
                </div>
              }
            />
            <DetailItem
              label="Phòng"
              value={
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  #{reservation.idRoom}
                </span>
              }
              icon="door-open"
            />
          </div>

          {/* Cột phải */}
          <div className="space-y-4">
            <DetailItem
              label="Thời gian"
              value={
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-calendar text-blue-500"></i>
                    {dayjs(reservation.checkIndate).format("DD/MM/YYYY HH:mm")}
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa fa-calendar text-red-500"></i>
                    {dayjs(reservation.checkOutdate).format("DD/MM/YYYY HH:mm")}
                  </div>
                </div>
              }
            />
            <DetailItem
              label="Số khách"
              value={
                <div className="flex items-center gap-2">
                  <i className="fa fa-users text-purple-500"></i>
                  {reservation.numGuest} người
                </div>
              }
            />
            <DetailItem
              label="Tổng tiền"
              value={
                <div className="text-xl font-semibold text-green-600">
                  {reservation.totalPrice?.toLocaleString()} VND
                </div>
              }
            />
            <DetailItem
              label="Trạng thái"
              value={
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    reservation.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : reservation.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {reservation.status}
                </span>
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-red-600 hover:text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );

  // Component DetailItem được cải tiến
  const DetailItem: React.FC<{
    label: string;
    value: React.ReactNode;
    icon?: string;
  }> = ({ label, value, icon }) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {icon && <i className={`fa fa-${icon} w-4`}></i>}
        {label}
      </div>
      <div className="text-gray-800 pl-6">{value}</div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý Đặt phòng</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {/* Nút lọc tất cả */}
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              filterStatus === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleStatusFilter("all")}
          >
            Tất cả
          </button>

          {/* Các nút lọc trạng thái */}
          {["Pending", "Confirmed", "Cancelled"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {/* Dropdown chọn loại ngày */}
          <select
            className="border rounded px-2 py-2 text-sm"
            value={dateFilter.type}
            onChange={(e) =>
              setDateFilter((prev) => ({
                ...prev,
                type: e.target.value as "checkIn" | "checkOut" | "createdAt",
              }))
            }
          >
            <option value="">Chọn loại ngày</option>
            <option value="checkIn">Ngày check-in</option>
            <option value="checkOut">Ngày check-out</option>
            <option value="createdAt">Ngày đặt</option>
          </select>

          {/* Input chọn ngày */}
          <input
            type="date"
            className="border rounded px-4 py-2 text-sm"
            value={dateFilter.value}
            onChange={(e) =>
              setDateFilter((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
          />

          {/* Nút xóa filter */}
          {dateFilter.type && (
            <button
              className="px-2 text-red-500 hover:text-red-700"
              onClick={() => setDateFilter({ type: "", value: "" })}
            >
              <i className="fa fa-times"></i>
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm đặt phòng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-1/3 text-sm"
        />
      </div>

      {loading && (
        <p className="text-center text-blue-500">Đang tải dữ liệu...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-gray-500 font-bold text-sm">
              <tr>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("firstName")}
                >
                  Khách hàng{" "}
                  {sortField === "firstName" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("checkIndate")}
                >
                  Check-in{" "}
                  {sortField === "checkIndate" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("checkOutdate")}
                >
                  Check-out{" "}
                  {sortField === "checkOutdate" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Trạng thái{" "}
                  {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("totalPrice")}
                >
                  Tổng tiền{" "}
                  {sortField === "totalPrice" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Ngày đặt{" "}
                  {sortField === "createdAt" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {currentRows.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-5">{`${reservation.firstName} ${reservation.lastName}`}</td>
                  <td className="px-4 py-5">
                    {dayjs(reservation.checkIndate).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="px-4 py-5">
                    {dayjs(reservation.checkOutdate).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="px-4 py-5">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        reservation.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : reservation.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    {reservation.totalPrice?.toLocaleString()} VND
                  </td>
                  <td className="px-4 py-5">
                    {dayjs(reservation.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <i
                        className="fa fa-eye text-gray-500 text-lg cursor-pointer hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click lan ra cả hàng
                          handleViewDetail(reservation);
                        }}
                      ></i>
                      <button
                        className="flex items-center px-3 py-1 text-sm text-red-700 hover:bg-gray-100 rounded"
                        onClick={() => handleCancel(reservation.id)}
                      >
                        <i className="fa fa-times-circle text-red-500 text-lg cursor-pointer hover:text-red-700"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      )}

      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
};
const PaginationButton: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ children, active = false, disabled = false, onClick }) => (
  <button
    className={`px-3 py-1 rounded-md ${
      active
        ? "bg-blue-500 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    } ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
    } transition-all`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default ManageReservationContainer;
