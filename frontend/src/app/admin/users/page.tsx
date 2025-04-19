"use client";
import { useState, useEffect } from "react";
import apisAdmin from "@/api/admin"; 

const ManageUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apisAdmin.listUsers();
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data); 
        } else {
          setUsers([]); 
        }
      } catch (error: any) {
        setError(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
        setUsers([]); 
      } finally {
        setLoading(false); 
      }
    };

    fetchUsers();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

      {}
      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-bold">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Tình trạng</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.status}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline">Sửa</button>
                    <button className="text-red-600 hover:underline ml-4">Xóa</button>
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
      </div>
    </div>
  );
};

export default ManageUsersPage;