"use client";
import React, { useEffect, useState } from "react";
import apisAdmin from "@/api/admin";
import { useSearchParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import "font-awesome/css/font-awesome.min.css";
import { showErrorAlert ,showConfirmAlert,showSuccessAlert} from "@/helper/Alert";

interface IRoom {
  id: string;
  idProperty: string;
  name: string;
  price: number;
  maxPerson: number;
  status: string;
  image: string;
  description: string;
  type: string;
  images: string[];
  amenities: { name: string }[];
  createdAt: string;
  updatedAt: string;
}

const RoomContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get("propertyId");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState<{ id: string; name: string }[]>([]);
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredRooms = rooms
    .filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const fieldA = a[sortField as keyof IRoom];
      const fieldB = b[sortField as keyof IRoom];
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

  const currentRows = filteredRooms.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRooms.length / rowsPerPage);

  const fetchRooms = async () => {
    if (!propertyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apisAdmin.listRooms(propertyId);
      const mappedRooms : IRoom[] = response.data.map((room: IRoom) => ({
        id: room.id,
        name: room.name,
        price: room.price,
        maxPerson: room.maxPerson,
        status: room.status,
        image: room.image || "",
        description: room.description || "Không có mô tả",
        type: room.type || "",
        amenities: room.amenities || [],
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      }));
      setRooms(mappedRooms);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng:", err);
      setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
              const confirm = await showConfirmAlert("Bạn chắc chắn muốn hủy đặt phòng này?");
    if (confirm) {
      try {
        await apisAdmin.deleteRoom(id);
        setRooms((prev) => prev.filter((room) => room.id !== id));
        showSuccessAlert("Xóa thành công!");
      } catch {
        showErrorAlert("Xóa thất bại!");
      }
    }
  };

  const handleShowDetail = (room: IRoom) => {
    setSelectedRoom(room);
    setIsEditing(false);
    setEditingRoom(null);
    setShowDetail(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editingRoom) {
      setEditingRoom({
        ...editingRoom,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleAmenityChange = (id: string) => {
    if (!editingRoom) return;
    const amenity = amenitiesList.find((am) => am.id === id);
    if (!amenity) return;
    const exists = editingRoom.amenities.some((a) => a.name === amenity.name);
    let newAmenities;
    if (exists) {
      newAmenities = editingRoom.amenities.filter((a) => a.name !== amenity.name);
    } else {
      newAmenities = [...editingRoom.amenities, { name: amenity.name }];
    }
    setEditingRoom({ ...editingRoom, amenities: newAmenities });
  };

  const handleEditConfirm = async () => {
    if (editingRoom) {
      try {
        await apisAdmin.updateRoom(editingRoom.id, {
          ...editingRoom,
          amenities: editingRoom.amenities.map((a) => a.name),
        });
        setIsEditing(false);
        setShowDetail(false);
        setEditingRoom(null);
        fetchRooms();
        showSuccessAlert("Cập nhật thành công!");
      } catch {
        showErrorAlert("Cập nhật thất bại!");
      }
    }
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
    fetchRooms();
  }, [propertyId]);

  return (
    <div className="p-6">
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => router.push("/admin/Properties")}
      >
        Quay lại
      </button>

      <h1 className="text-2xl font-bold mb-6">Danh sách phòng</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm phòng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-1/3 text-sm"
        />
      </div>

      {loading && <p className="text-center text-blue-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && rooms.length === 0 && (
        <p className="text-center text-gray-500">Không có phòng nào được tìm thấy.</p>
      )}

      {!loading && !error && rooms.length > 0 && (
        <>
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-gray-500 font-bold text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Hình ảnh</th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("name")}>
                  Tên phòng {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("price")}>
                  Giá {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("maxPerson")}>
                  Số người tối đa {sortField === "maxPerson" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("status")}>
                  Trạng thái {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("createdAt")}>
                  Ngày tạo {sortField === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {currentRows.map((room) => (
                <tr key={room.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-4 py-5">
                    {room.image ? (
                      <img src={room.image} alt="Room" className="w-16 h-16 rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-5">{room.name}</td>
                  <td className="px-4 py-5">{room.price.toLocaleString()} VND</td>
                  <td className="px-4 py-5">{room.maxPerson}</td>
                  <td className="px-4 py-5">{room.status}</td>
                  <td className="px-4 py-5">{dayjs(room.createdAt).format("DD/MM/YYYY")}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-grey-500 hover:text-blue-700"
                        title="Xem chi tiết"
                        onClick={() => handleShowDetail(room)}
                      >
                        <i className="fa fa-eye"></i>
                      </button>
                      <button
                        className="flex items-center px-3 py-1 text-sm text-red-700 hover:bg-gray-100 rounded"
                        title="Xóa phòng"
                        onClick={() => handleDelete(room.id)}
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
                  currentPage === index + 1 ? "bg-orange-500 text-white" : "bg-gray-300 hover:bg-gray-400"
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

      {/* Modal chi tiết & chỉnh sửa phòng */}
      {showDetail && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => {
                setShowDetail(false);
                setIsEditing(false);
                setEditingRoom(null);
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Chi tiết phòng</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditConfirm();
              }}
            >
              <div className="mb-4 flex justify-center">
                {selectedRoom.image ? (
                  <img src={selectedRoom.image} alt="Room" className="w-32 h-32 rounded-md" />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tên phòng</label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? editingRoom?.name ?? "" : selectedRoom.name}
                  disabled={!isEditing}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Giá</label>
                <input
                  type="number"
                  name="price"
                  value={isEditing ? editingRoom?.price ?? "" : selectedRoom.price}
                  disabled={!isEditing}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Số người tối đa</label>
                <input
                  type="number"
                  name="maxPerson"
                  value={isEditing ? editingRoom?.maxPerson ?? "" : selectedRoom.maxPerson}
                  disabled={!isEditing}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Trạng thái</label>
                <select
                  name="status"
                  value={isEditing ? editingRoom?.status ?? "" : selectedRoom.status}
                  disabled={!isEditing}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Locked">Locked</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={isEditing ? editingRoom?.description ?? "" : selectedRoom.description}
                  disabled={!isEditing}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tiện ích</label>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((am) => (
                    <label key={am.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        disabled={!isEditing}
                        checked={
                          (isEditing
                            ? editingRoom?.amenities ?? []
                            : selectedRoom.amenities ?? []
                          ).some((a) => a.name === am.name)
                        }
                        onChange={() => handleAmenityChange(am.id)}
                      />
                      <span>{am.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {!isEditing && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    onClick={() => {
                      setEditingRoom({ ...selectedRoom, amenities: [...selectedRoom.amenities] });
                      setIsEditing(true);
                    }}
                  >
                    Chỉnh sửa
                  </button>
                )}
                {isEditing && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Lưu
                  </button>
                )}
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                  onClick={() => {
                    setShowDetail(false);
                    setIsEditing(false);
                    setEditingRoom(null);
                  }}
                >
                  {isEditing ? "Hủy" : "Đóng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomContainer;
