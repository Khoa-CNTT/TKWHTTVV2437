"use client";

import ManageAmenityContainer from "@/components/container/AmenityContainer"; // Đường dẫn đúng tới file
import { FaSwimmer, FaUmbrellaBeach, FaWifi } from "react-icons/fa";
import { LuCircleParking } from "react-icons/lu";
import { MdFamilyRestroom, MdRestaurant } from "react-icons/md";
import { TbBus, TbSmokingNo } from "react-icons/tb";

interface Amenity {
  icon: string; // Tên icon (key trong `iconMap`)
  name: string; // Tên tiện ích
}

const amenities: Amenity[] = [
  { icon: "FaSwimmer", name: "Hồ bơi" },
  { icon: "TbSmokingNo", name: "Không hút thuốc" },
  { icon: "FaWifi", name: "Wi-Fi miễn phí" },
  { icon: "LuCircleParking", name: "Bãi đỗ xe" },
  { icon: "FaUmbrellaBeach", name: "Bãi biển riêng" },
  { icon: "MdRestaurant", name: "Nhà hàng" },
  { icon: "TbBus", name: "Đưa đón sân bay" },
  { icon: "MdFamilyRestroom", name: "Phù hợp gia đình" },
];

const ManageUsersPage = () => {
  return <ManageAmenityContainer amenities={amenities} />;
};

export default ManageUsersPage;
