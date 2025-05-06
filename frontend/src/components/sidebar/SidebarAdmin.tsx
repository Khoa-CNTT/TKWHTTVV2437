"use client";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaHome,
  FaCogs,
  FaBook,
  FaMoneyBill,
  FaCheckCircle,
  FaWpforms,
} from "react-icons/fa";

const SidebarAdmin = () => {
  const router = useRouter();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
    },
    {
      title: "Accounts",
      icon: <FaUsers />,
      path: "/admin/Account",
    },
    {
      title: "Properties",
      icon: <FaHome />,
      path: "/admin/Properties",
    },
    // {
    //   title: "Quản lý Amenities",
    //   icon: <FaCogs />,
    //   path: "/admin/amenities",
    // },
    // {
    //   title: "Quản lý Bookings",
    //   icon: <FaBook />,
    //   path: "/admin/bookings",
    // },
    {
      title: "Reservation",
      icon: <FaWpforms />,
      path: "/admin/Reservation",
    },
    {
      title: "Verification",
      icon: <FaCheckCircle />,
      path: "/admin/Verification",
    },
    {
      title: "Thanh toán",
      icon: <FaMoneyBill />,
      path: "/admin/Payment",
    },
  ];

  return (
    <div className="py-4 px-2 bg-gray-100 min-h-screen shadow-md">
      <div className="flex justify-center font-semibold text-xl mb-6">
        Trang quản lý Admin
      </div>
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 font-medium px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => router.push(item.path)}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarAdmin;
