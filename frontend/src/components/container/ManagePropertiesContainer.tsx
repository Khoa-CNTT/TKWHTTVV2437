import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import apisAdmin from "@/api/admin";
import dayjs from "dayjs";
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS
import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
} from "@/helper/Alert";

// Interface cho Property
interface IRoom {
  id: string;
  name: string;
  price: number;
  maxPerson: number;
  status: string;
  images: string[];
  amenities: { name: string }[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface IProperty {
  id: string;
  name: string;
  address?: {
    city?: string;
  };
  description: string;
  category?: {
    name?: string;
  };
  status: string;
  image: string;
  amenities: { name: string }[];
  createdAt: string;
  updatedAt: string;
  rooms?: IRoom[];
  priceRange: string;
}

interface IRoomResponse {
  price: number;
}

const ManagePropertiesContainer: React.FC = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Từ khóa tìm kiếm
  const [sortField, setSortField] = useState<string>(""); // Trường sắp xếp
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Thứ tự sắp xếp
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const rowsPerPage = 10; // Số lượng properties trên mỗi trang
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Lọc và sắp xếp dữ liệu
  const filteredProperties = properties
    .filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.city
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const fieldA = a[sortField as keyof IProperty];
      const fieldB = b[sortField as keyof IProperty];
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });

  const currentRows = filteredProperties.slice(indexOfFirstRow, indexOfLastRow); // Lọc theo trang
  const totalPages = Math.ceil(filteredProperties.length / rowsPerPage);

  // Lấy danh sách properties
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apisAdmin.listHomestays();
      const mappedProperties: IProperty[] = response.data.map(
        (property: IProperty) => {
          // Xử lý rooms với kiểu dữ liệu cụ thể
          const rooms = property.rooms || [];
          const prices = rooms
            .map((room: IRoomResponse) => room.price)
            .filter((price: number) => price > 0);

          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          return {
            id: property?.id,
            name: property?.name,
            city: property?.address?.city || "Không xác định",
            description: property?.description || "Không có mô tả",
            type: property?.category?.name || "Không xác định",
            status: property?.status,
            image: property?.image,
            amenities: property?.amenities,
            createdAt: property?.createdAt,
            updatedAt: property?.updatedAt,
            priceRange:
              prices.length > 0
                ? `${minPrice?.toLocaleString()} ~ ${maxPrice?.toLocaleString()}`
                : "Không có giá",
          };
        }
      );
      setProperties(mappedProperties);
    } catch (err) {
      console.error("Lỗi khi tải danh sách properties:", err);
      setError("Không thể tải danh sách properties. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    const confirm = await showConfirmAlert(
      "Bạn chắc chắn muốn hủy đặt phòng này?"
    );
    if (confirm) {
      try {
        await apisAdmin.deleteHomestay(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
        showSuccessAlert("Xóa thành công!");
      } catch (error) {
        showErrorAlert("Xóa thất bại!");
      }
    }
    setOpenMenuId(null);
  };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý Properties</h1>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm..."
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
                  onClick={() => handleSort("name")}
                >
                  Tên{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("city")}
                >
                  Thành phố{" "}
                  {sortField === "city" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  Mô tả{" "}
                  {sortField === "description" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  Loại{" "}
                  {sortField === "type" && (sortOrder === "asc" ? "▲" : "▼")}
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
                  onClick={() => handleSort("priceRange")}
                >
                  Giá cả{" "}
                  {sortField === "priceRange" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Ngày tạo{" "}
                  {sortField === "createdAt" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {currentRows.map((property) => (
                <tr
                  key={property?.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-5">{property?.name}</td>
                  <td className="px-4 py-5">{property?.address?.city}</td>
                  <td className="px-4 py-5">{property?.description}</td>
                  <td className="px-4 py-5">{property?.category?.name}</td>
                  <td className="px-4 py-5">{property?.status}</td>
                  <td className="px-4 py-5">{property?.priceRange}</td>
                  <td className="px-4 py-5">
                    {dayjs(property?.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-5 ">
                    <div className="flex items-center gap-3">
                      <i
                        className="fa fa-eye text-grey-500 text-lg cursor-pointer hover:text-blue-700"
                        onClick={() =>
                          router.push(
                            `/admin/Properties/Room?propertyId=${property?.id}`
                          )
                        }
                      ></i>
                      <button
                        className="flex items-center px-3 py-1 text-sm text-red-700 hover:bg-gray-100 rounded"
                        onClick={() => handleDelete(property?.id)}
                      >
                        <i className="fa fa-trash text-red-500 text-lg cursor-pointer hover:text-red-700"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Thanh chuyển trang */}
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
    </div>
  );
};

export default ManagePropertiesContainer;
