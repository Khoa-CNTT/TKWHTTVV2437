import React, { useState } from "react";

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  role: string; 

}
const UserTable = ({ users }: { users: IUser[] }) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null); // State lưu trữ user được chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // State điều khiển modal

  const handleRowClick = (user: IUser) => {
    setSelectedUser(user); 
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setSelectedUser(null); 
  };

  
  const getRoleClass = (role: string) => {
    switch (role) {
      case "User":
        return "bg-green-500 text-white";
      case "Owner":
        return "bg-yellow-500 text-white"; 
      case "Admin":
        return "bg-red-500 text-white"; 
      default:
        return "bg-gray-500 text-white"; 
    }
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-md">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-bold">
          <tr>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Số điện thoại</th>
            <th className="px-4 py-3">Tình trạng</th>
            <th className="px-4 py-3">Vai trò</th> 
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(user)} 
              >
                <td className="px-4 py-3">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone}</td>
                <td className="px-4 py-3">{user.status}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleClass(user.role)}`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Không có dữ liệu người dùng
              </td>
            </tr>
          )}
        </tbody>
      </table>

     
{isModalOpen && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-lg font-bold mb-4">Thông tin chi tiết</h2>
      <p><strong>Tên:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Số điện thoại:</strong> {selectedUser.phone}</p>
      <p><strong>Tình trạng:</strong> {selectedUser.status}</p>
      <p><strong>Vai trò:</strong> {selectedUser.role}</p>
      <p><strong>Ngày tạo:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
      <p><strong>Ngày cập nhật:</strong> {new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={closeModal}
      >
        Đóng
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default UserTable;