"use client";
import React, { useState, useEffect } from "react";
import apisAdmin from "@/api/admin";
import dayjs from "dayjs";
import validate from "@/utils/validateInput";
import "font-awesome/css/font-awesome.min.css";

import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "@/helper/Alert";
import { FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { useSearchParamsWrapper } from "@/hooks/useSearchParamsWrapper";

// Interface chung cho người dùng
interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  bio: string;
  gender: string;
  dateOfBirth: Date;
  emergencyPhone: string;
  address: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
interface IInvalidField {
  name: string; // Tên trường không hợp lệ
  mes: string; // Thông báo lỗi
}
interface UserFormState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  bio: string;
  gender: string;
  dateOfBirth: Date;
  emergencyPhone: string;
  address: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
const ManageUserContainer: React.FC = () => {
  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);
  const [users, setUsers] = useState<IUser[]>([]); // Danh sách người dùng
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null); // User được chọn
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false); // Trạng thái mở modal thêm mới
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null); // Trạng thái xóa người dùng
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof IUser>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [searchTerm, setSearchTerm] = useState<string>(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const filteredUsers = users
    .filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    )
    .filter(
      (user) =>
        (filterRole === "all" || user.role === filterRole) &&
        (filterStatus === "all" || user.status === filterStatus) &&
        !(user.role === "Owner" && user.status === "Pending")
    )
    .sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });

  const currentRows = filteredUsers.slice(indexOfFirstRow, indexOfLastRow); // Lọc trước khi phân trang
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const handleSort = (field: keyof IUser) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  // Hàm tải danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apisAdmin.listUsers();
      setUsers(response.data);
    } catch (error) {
      const errorMessage =
        (error as { msg?: string })?.msg ??
        "Đã xảy ra lỗi khi tải danh sách người dùng.";
      showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleLockUser = async (userId: string) => {
    try {
      const confirmLock = await showConfirmAlert(
        "Bạn có chắc chắn muốn khóa tài khoản này?"
      );
      if (confirmLock) {
        await apisAdmin.lockAccount(userId); // Gọi API khóa tài khoản
        showSuccessAlert("Tài khoản đã được khóa thành công!");
        fetchUsers(); // Tải lại danh sách người dùng
      }
    } catch (error) {
      const errorMessage =
        (error as { msg?: string })?.msg ??
        "Đã xảy ra lỗi khi khoá người dùng.";
      showErrorAlert(errorMessage);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmDelete = await showConfirmAlert(
      "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
    );
    if (confirmDelete) {
      setDeletingUserId(userId); // Đặt trạng thái xóa
      try {
        await apisAdmin.deleteUser(userId); // Gọi API xóa người dùng
        showSuccessAlert("Người dùng đã được xóa thành công!");
        fetchUsers(); // Tải lại danh sách người dùng
      } catch (error) {
        const errorMessage =
          (error as { msg?: string })?.msg ??
          "Đã xảy ra lỗi khi xoá người dùng.";
        showErrorAlert(errorMessage);
      } finally {
        setDeletingUserId(null); // Xóa trạng thái xóa
      }
    }
  };

  // Gọi fetchUsers khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Component hiển thị bảng danh sách người dùng
  const UserTable: React.FC<{
    users: IUser[];
    // onApproveUser: (userId: string) => void;
    onDeleteUser: (userId: string) => void;
    onLockUser: (userId: string) => void;
    onSelectUser: (user: IUser) => void;
    deletingUserId: string | null;
  }> = ({
    users,
    onDeleteUser,
    onLockUser,
    onSelectUser,
    /*onApproveUser,*/ deletingUserId,
  }) => {
    const getRoleClass = (role: string) => {
      switch (role) {
        case "3":
          return "bg-green-500 text-white";
        case "7":
          return "bg-yellow-500 text-white";
        case "9":
          return "bg-red-500 text-white";
        default:
          return "bg-gray-500 text-white";
      }
    };

    const getStatusClass = (status: string) => {
      switch (status) {
        case "active":
          return "bg-blue-100 text-blue-700";
        case "banned":
          return "bg-orange-100 text-orange-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    return (
      <table className="min-w-full text-black rounded-2xl">
        <thead className="bg-gray-200 text-[14px] text-gray-500 font-bold">
          <tr>
            <th
              className="px-4 py-3 text-left rounded-tl-2xl cursor-pointer"
              onClick={() => handleSort("firstName")}
            >
              Họ và Tên{" "}
              {sortField === "firstName" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer"
              onClick={() => handleSort("phone")}
            >
              Số điện thoại{" "}
              {sortField === "phone" && (sortOrder === "asc" ? "▲" : "▼")}
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
              onClick={() => handleSort("role")}
            >
              Vai trò{" "}
              {sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-3 text-left rounded-tr-2xl">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-sm font-semibold">
          {currentRows.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectUser(user)}
            >
              <td className="px-4 py-5">{`${user.firstName} ${user.lastName}`}</td>
              <td className="px-4 py-5">{user.email}</td>
              <td className="px-4 py-5">{user.phone}</td>
              <td className="px-4 py-5">
                <span
                  className={`px-2 py-1 rounded-full ${getStatusClass(
                    user.status || "Active"
                  )}`}
                >
                  {user.status == "active" ? "Hoạt động" : "Khóa"}
                </span>
              </td>
              <td className="px-4 py-5">
                <span
                  className={`px-2 py-1 rounded-full ${getRoleClass(
                    user.role === "3"
                      ? "User"
                      : user.role === "7"
                        ? "Owner"
                        : "Admin"
                  )}`}
                >
                  {user?.role == "3"
                    ? "Khách hàng"
                    : user?.role == "7"
                      ? "Chủ sở hữu"
                      : "Admin"}
                </span>
              </td>
              <td className="px-4 py-5">
                <div className="flex items-center gap-3 text-[20px]">
                  {/* {user.status === "Pending" && (
            <i
                className="fa fa-check-circle text-green-500 text-lg cursor-pointer hover:text-green-700"
                onClick={(e) => {
                    e.stopPropagation();
                    onApproveUser(user.id); // Thêm prop này
                }}
            ></i>
        )} */}
                  <i
                    className=" text-gray-500 text-[20px] cursor-pointer hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUser(user);
                    }}
                  >
                    <FaInfoCircle />
                  </i>
                  <button
                    className="text-red-500 text-[18px] cursor-pointer hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteUser(user.id);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Component thêm người dùng mới
  const AddUserModal: React.FC<{
    onClose: () => void;
    onUserAdded: () => void;
  }> = ({ onClose, onUserAdded }) => {
    const [newUser, setNewUser] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      avatar: "",
      bio: "",
      gender: "",
      dateOfBirth: "",
      emergencyPhone: "",
      address: "",
      role: "3",
      status: "Active",
    });

    const handleInputChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = async () => {
      // Kiểm tra tính hợp lệ
      const payload = {
        ...newUser,
        dateOfBirth: new Date(newUser.dateOfBirth), // Chuyển string -> Date
      };

      const invalidCount = validate(
        {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.phone,
        },
        setInvalidFields
      );
      if (invalidCount > 0) {
        showErrorAlert("Vui lòng kiểm tra lại các trường nhập liệu.");
        return;
      }
      try {
        await apisAdmin.createUser(payload);
        showSuccessAlert("Người dùng đã được thêm thành công!");
        onUserAdded();
        onClose();
      } catch (error) {
        const errorMessage =
          (error as { msg?: string })?.msg ??
          "Đã xảy ra lỗi khi thêm mới người dùng.";
        showErrorAlert(errorMessage);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-full h-full overflow-y-auto">
          <h2 className="text-2xl font-bold mb-8">Thêm người dùng mới</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Họ</label>
              <input
                type="text"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
                className={`border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  invalidFields.some((f) => f.name === "lastName")
                    ? "border-red-500"
                    : ""
                }`}
              />
              {invalidFields.some((f) => f.name === "lastName") && (
                <p className="text-red-500 text-sm">
                  {invalidFields.find((f) => f.name === "lastName")?.mes}
                </p>
              )}
            </div>

            {/* Tên */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Tên</label>
              <input
                type="text"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
                className={`border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  invalidFields.some((f) => f.name === "firstName")
                    ? "border-red-500"
                    : ""
                }`}
              />
              {invalidFields.some((f) => f.name === "firstName") && (
                <p className="text-red-500 text-sm">
                  {invalidFields.find((f) => f.name === "firstName")?.mes}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className={`border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  invalidFields.some((f) => f.name === "email")
                    ? "border-red-500"
                    : ""
                }`}
              />
              {invalidFields.some((f) => f.name === "email") && (
                <p className="text-red-500 text-sm">
                  {invalidFields.find((f) => f.name === "email")?.mes}
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={handleInputChange}
                className={`border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  invalidFields.some((f) => f.name === "phone")
                    ? "border-red-500"
                    : ""
                }`}
              />
              {invalidFields.some((f) => f.name === "phone") && (
                <p className="text-red-500 text-sm">
                  {invalidFields.find((f) => f.name === "phone")?.mes}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className={`border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  invalidFields.some((f) => f.name === "password")
                    ? "border-red-500"
                    : ""
                }`}
              />
              {invalidFields.some((f) => f.name === "password") && (
                <p className="text-red-500 text-sm">
                  {invalidFields.find((f) => f.name === "password")?.mes}
                </p>
              )}
            </div>

            {/* Giới tính */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Giới tính</label>
              <select
                name="gender"
                value={newUser.gender}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="Female">Nữ</option>
                <option value="Male">Nam</option>
                <option value="unspecified">Không xác định (X)</option>
                <option value="undisclosed">Không tiết lộ (U)</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={newUser.dateOfBirth}
                onChange={(e) => {
                  setNewUser((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value
                      ? dayjs(e.target.value).format("YYYY-MM-DD")
                      : "",
                  }));
                }}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Số điện thoại khẩn cấp */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Số khẩn cấp</label>
              <input
                type="text"
                name="emergencyPhone"
                value={newUser.emergencyPhone}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Vai trò</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="9">Admin</option>
                <option value="3">Khách hàng</option>
                <option value="7">Chủ sở hữu</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Trạng thái</label>
              <select
                name="status"
                value={newUser.status}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Đang hoạt động</option>
                <option value="banned">Khóa</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="font-semibold text-sm">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleInputChange}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Giới thiệu */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="font-semibold text-sm">Giới thiệu</label>
              <textarea
                name="bio"
                value={newUser.bio}
                onChange={handleInputChange}
                rows={3}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              onClick={handleAddUser}
            >
              Thêm
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Component chi tiết người dùng
  const DetailUser: React.FC<{
    user: IUser;
    onClose: () => void;
    onUpdate: () => void;
  }> = ({ user, onClose, onUpdate }) => {
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      if (editingUser) {
        setEditingUser({
          ...editingUser,
          [e.target.name]: e.target.value,
        });
      }
    };

    const handleEditConfirm = async () => {
      if (editingUser) {
        const phoneRegex = /^(0)(3|5|7|8|9)+([0-9]{8})$/;
        if (!phoneRegex.test(editingUser.phone)) {
          setInvalidFields((prev) => [
            ...prev,
            { name: "phone", mes: "Sai định dạng số điện thoại VN" },
          ]);
          showErrorAlert("Vui lòng kiểm tra lại các trường nhập liệu.");
          return;
        }
        try {
          await apisAdmin.updateUser(editingUser.id, editingUser);
          showSuccessAlert("Thông tin người dùng đã được cập nhật thành công!");
          setIsEditing(false);
          onClose();
          onUpdate();
        } catch (error) {
          showErrorAlert("Đã xảy ra lỗi khi cập nhật người dùng.");
        }
      }
    };

    return (
      <div className="fixed inset-0 flex">
        <div className="flex-1 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="w-2/5 bg-white h-full p-6 shadow-lg flex flex-col justify-between transform transition-transform duration-300 translate-x-0">
          <div>
            <h2 className="text-lg font-bold mb-4">Thông tin chi tiết</h2>
            <div className="flex flex-col gap-4">
              {/* Avatar */}

              {/* Basic Info */}
              <div className="flex gap-4">
                {/* Họ */}
                <div className="flex flex-col gap-1 w-1/2">
                  <p className="font-semibold text-sm">Họ</p>
                  <input
                    type="text"
                    name="lastName"
                    value={editingUser ? editingUser.lastName : user.lastName}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tên */}
                <div className="flex flex-col gap-1 w-1/2">
                  <p className="font-semibold text-sm">Tên</p>
                  <input
                    type="text"
                    name="firstName"
                    value={editingUser ? editingUser.firstName : user.firstName}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-1/2">
                  <p className="font-semibold text-sm ">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={editingUser ? editingUser.email : user.email}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <p className="font-semibold text-sm">Điện thoại di động</p>
                  <input
                    type="text"
                    name="phone"
                    value={editingUser ? editingUser.phone : user.phone}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div></div>

              {/* Additional Info */}

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block font-bold text-sm mb-1">
                    Giới tính:
                  </label>
                  <select
                    name="gender"
                    value={
                      editingUser ? editingUser.gender || "" : user.gender || ""
                    }
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Female">Nữ</option>
                    <option value="Male">Nam</option>
                    <option value="unspecified">Không xác định (X)</option>
                    <option value="undisclosed">Không tiết lộ (U)</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block font-bold text-sm mb-1">
                    Ngày sinh:
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={
                      user?.dateOfBirth
                        ? dayjs(user.dateOfBirth, [
                            "YYYY-MM-DD",
                            "DD/MM/YYYY",
                            "MM/DD/YYYY",
                          ]).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status and Role */}
              <div>
                <label className="block font-bold text-sm">Trạng thái:</label>
                <select
                  name="status"
                  value={editingUser ? editingUser.status : user.status}
                  onChange={handleEditChange}
                  disabled={!isEditing}
                  className="border rounded px-2 py-1 w-full text-sm"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="banned">Khóa</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-sm">Vai trò:</label>
                <select
                  name="role"
                  value={editingUser ? editingUser.role : user.role}
                  onChange={handleEditChange}
                  disabled={!isEditing}
                  className="border rounded px-2 py-1 w-full text-sm"
                >
                  <option value="3">Khách hàng</option>
                  <option value="7">Chủ sở hữu</option>
                  <option value="9">Admin</option>
                </select>
              </div>
              <div></div>

              {/* Emergency Contact */}
              <div>
                <label className="block font-bold text-sm mb-1">
                  Số khẩn cấp:
                </label>
                <input
                  type="text"
                  name="emergencyPhone"
                  value={
                    editingUser
                      ? editingUser.emergencyPhone || ""
                      : user.emergencyPhone || ""
                  }
                  onChange={handleEditChange}
                  disabled={!isEditing}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className="block font-bold text-sm mb-1">Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={
                    editingUser ? editingUser.address || "" : user.address || ""
                  }
                  onChange={handleEditChange}
                  disabled={!isEditing}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div className="col-span-2">
                <label className="block font-bold text-sm mb-1">
                  Giới thiệu:
                </label>
                <textarea
                  name="bio"
                  value={editingUser ? editingUser.bio || "" : user.bio || ""}
                  onChange={handleEditChange}
                  disabled={!isEditing}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {isEditing ? (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                onClick={handleEditConfirm}
              >
                Lưu
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                onClick={() => {
                  setEditingUser({ ...user });
                  setIsEditing(true);
                }}
              >
                Chỉnh sửa
              </button>
            )}
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="p-4">
      {/* Các controls và bảng hiển thị */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Roles</option>
            <option value="3">User</option>
            <option value="7">Owner</option>
            <option value="9">Admin</option>
          </select>
          {/* Các controls khác */}
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      {/* Bảng người dùng */}

      <UserTable
        users={currentRows}
        onDeleteUser={handleDeleteUser}
        onLockUser={handleLockUser}
        onSelectUser={setSelectedUser}
        deletingUserId={deletingUserId}
      />

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal thêm mới */}
      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onUserAdded={fetchUsers}
        />
      )}

      {/* Modal chi tiết */}
      {selectedUser && (
        <DetailUser
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
};

export default ManageUserContainer;
