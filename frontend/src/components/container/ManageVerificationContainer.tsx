"use client"
import React, { useState, useEffect } from "react";
import apisAdmin from "@/api/admin";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { showSuccessAlert, showErrorAlert } from "@/helper/Alert";

interface IOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  createdAt: string;
}

const VerificationContainer: React.FC = () => {
  const router = useRouter();
  const [owners, setOwners] = useState<IOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchOwners = async () => {
    try {
      const response = await apisAdmin.listUsers();
      const filteredOwners :IOwner[] = response.data.filter((user: IOwner) => user.role === "Owner" && user.status == "Pending");
      setOwners(filteredOwners);
    } catch (err) {
      setError("Không thể tải danh sách chủ sở hữu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleViewProperties = (ownerId: string) => {
    router.push(`/admin/Verification/Properties?ownerId=${ownerId}`);
  };

  const handleVerifyOwner = async (ownerId: string) => {
    try {
      await apisAdmin.approveOwner(ownerId);
      showSuccessAlert("Xác minh thành công!");
      fetchOwners();
    } catch (error) {
      showErrorAlert("Lỗi khi xác minh chủ sở hữu");
    }
  };

  // Phân trang và filter
  const filteredData = owners.filter(owner =>
    `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone.includes(searchTerm)
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentOwners = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Xác minh Chủ sở hữu</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm kiếm chủ sở hữu..."
          className="border rounded px-4 py-2 w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-blue-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-gray-500 font-bold text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Họ và tên</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Số điện thoại</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {currentOwners.map((owner) => (
                <tr key={owner.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-4 py-5">{`${owner.firstName} ${owner.lastName}`}</td>
                  <td className="px-4 py-5">{owner.email}</td>
                  <td className="px-4 py-5">{owner.phone}</td>
                  <td className="px-4 py-5">
                    <span className={`px-2 py-1 rounded-full ${
                      owner.status === "Pending" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-4 py-5">{owner.role}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <button
                         className="fa fa-eye text-gray-500 text-lg cursor-pointer hover:text-blue-700"
                        onClick={() => handleViewProperties(owner.id)}
                      >
                      </button>
                      {owner.status !== "Verified" && (
                        <button
                        className="fa fa-check text-green-500 text-lg cursor-pointer hover:text-blue-700"
                          onClick={() => handleVerifyOwner(owner.id)}
                        >
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i+1}
                className={`px-3 py-1 rounded ${
                  currentPage === i+1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setCurrentPage(i+1)}
              >
                {i+1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VerificationContainer;