"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import apisAdmin from "@/api/admin";
import dayjs from "dayjs";
import "font-awesome/css/font-awesome.min.css";

interface IProperty {
  id: string;
  name: string;
  city: string;
  description: string;
  type: string;
  status: string;
  image: string;
  amenities: { name: string }[];
  createdAt: string;
  updatedAt: string;
  priceRange: string;
  rooms: IRoom[];
}

interface IRoom {
  id: string;
  name: string;
  price: number;
  maxPerson: number;
  status: string;
  images: string[]; // Thay đổi từ 'image' sang 'images'
  amenities: { name: string }[];
  description: string;
  createdAt: string;
  updatedAt: string;
}
const OwnerPropertiesContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("ownerId");

  // State cho Properties
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [propSearchTerm, setPropSearchTerm] = useState("");
  const [propSortOrder, setPropSortOrder] = useState<"asc" | "desc">("asc");
  const [propCurrentPage, setPropCurrentPage] = useState(1);
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  const [showRoomDetail, setShowRoomDetail] = useState(false);
  const [propSortField, setPropSortField] = useState<keyof IProperty | "">("");
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!ownerId) return;

      try {
        const response = await apisAdmin.listProperties(ownerId);

        // Sửa logic xử lý dữ liệu
    const processedProps = response.data
  .filter((p: any) => p.idUser === ownerId)
  .map((property: any) => ({
    ...property,
    city: property.address?.city || "Không xác định",
    type: property.category?.name || "Không có loại",
    rooms: (property.rooms || []).map((room: any) => ({
      id: room.id,
      name: room.name || "Chưa đặt tên",
      price: room.price || 0,
      maxPerson: room.maxPerson || 0, // Sửa tên trường theo API
      status: room.status || "Unknown",
      images: room.images?.map((img: any) => img.image) || [], // Xử lý images
      amenities: room.amenities?.map((am: any) => ({ name: am.name })) || [],
      description: room.description || "Không có mô tả",
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    })),
    priceRange: property.rooms?.length > 0 
      ? `${Math.min(...property.rooms.map((r: any) => r.price)).toLocaleString()} ~ ${Math.max(...property.rooms.map((r: any) => r.price)).toLocaleString()}`
      : "Không có giá"
  }));

        setProperties(processedProps);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, [ownerId]);

  // Xử lý sorting và pagination cho Properties
  const processedProperties = properties
    .filter(p =>
      p.name.toLowerCase().includes(propSearchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(propSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!propSortField) return 0;
      return propSortOrder === "asc"
        ? String(a[propSortField]).localeCompare(String(b[propSortField]))
        : String(b[propSortField]).localeCompare(String(a[propSortField]));
    });

  const propPaginated = processedProperties.slice(
    (propCurrentPage - 1) * rowsPerPage,
    propCurrentPage * rowsPerPage
  );

  const toggleExpand = (propertyId: string) => {
    setExpandedPropertyId(prev => prev === propertyId ? null : propertyId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách Properties</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm properties..."
          className="border rounded px-4 py-2 w-1/3"
          onChange={(e) => setPropSearchTerm(e.target.value)}
        />
      </div>

      <table className="min-w-full text-black">
        <thead className="bg-gray-200 text-gray-500 font-bold text-sm">
          <tr>
            <th className="px-4 py-3 text-left">Tên Property</th>
            <th className="px-4 py-3 text-left">Thành phố</th>
            <th className="px-4 py-3 text-left">Loại</th>
            <th className="px-4 py-3 text-left">Trạng thái</th>
            <th className="px-4 py-3 text-left">Khoảng giá</th>
            <th className="px-4 py-3 text-left"></th>
          </tr>
        </thead>
        <tbody className="text-sm font-semibold">
          {propPaginated.map(property => (
            <React.Fragment key={property.id}>
              <tr
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleExpand(property.id)}
              >
                <td className="px-4 py-5">{property.name}</td>
                <td className="px-4 py-5">{property.city}</td>
                <td className="px-4 py-5">{property.type}</td>
                <td className="px-4 py-5">
                  <span className={`px-2 py-1 rounded-full ${property.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }`}>
                    {property.status}
                  </span>
                </td>
                <td className="px-4 py-5">{property.priceRange}</td>
                <td className="px-4 py-5">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(property.id);
                    }}
                  >
                    {expandedPropertyId === property.id ? '▼' : '▶'}
                  </button>
                </td>
              </tr>

              {expandedPropertyId === property.id && (
                <tr className="bg-gray-50">
                  <td colSpan={6} className="px-4 py-5">
                    <div className="ml-8">
                      <h3 className="text-lg font-semibold mb-4">Danh sách Rooms</h3>
                      <table className="w-full">
                        <thead className="bg-gray-100 text-gray-600 font-bold text-sm">
                          <tr>
                            <th className="px-4 py-3 text-left">Tên phòng</th>
                            <th className="px-4 py-3 text-left">Giá</th>
                            <th className="px-4 py-3 text-left">Số người</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {property.rooms.map((room) => (
                            <tr
                            
                              key={`${room.id}`} // Sử dụng kết hợp property.id và index
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="px-4 py-4">{room.name || "Chưa đặt tên"}</td>
                              <td className="px-4 py-4">{room.price?.toLocaleString() || 0} VND</td>
                              <td className="px-4 py-4">{room.maxPerson || 0}</td>
                              <td className="px-4 py-4">
                                <span className={`px-2 py-1 rounded-full ${room.status === 'Active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                  }`}>
                                  {room.status || "Unknown"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: Math.ceil(processedProperties.length / rowsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${propCurrentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            onClick={() => setPropCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OwnerPropertiesContainer;