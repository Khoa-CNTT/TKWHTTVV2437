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
  FaClipboardList,
} from "react-icons/fa";
import { RiAdvertisementFill } from "react-icons/ri";
import { FaPersonBreastfeeding } from "react-icons/fa6";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const SidebarAdmin = () => {
  const router = useRouter();
  const pathname = usePathname();

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
      title: "Danh sách đơn đặt phòng",
      icon: <FaWpforms />,
      path: "/admin/Reservation",
    },
    {
      title: "Danh sách đăng kí dịch vụ",
      icon: <FaClipboardList />,
      path: "/admin/ListRegisterPartner",
    },
    // {
    //   title: "Verification",
    //   icon: <FaCheckCircle />,
    //   path: "/admin/Verification",
    // },
    // {
    //   title: "Thanh toán",
    //   icon: <FaMoneyBill />,
    //   path: "/admin/Payment",
    // },
    {
      title: "Thanh toán hoa hồng",
      icon: <FaPersonBreastfeeding />,
      path: "/admin/commission",
    },
    {
      title: "Đăng ký quảng cáo",
      icon: <RiAdvertisementFill />,
      path: "/admin/advertising",
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
            className={clsx(
              "mt-1 text-sm font-medium px-4 py-3 rounded-md cursor-pointer flex gap-3",
              pathname === item.path
                ? "bg-blue-700 text-white" // Active link styles
                : "hover:bg-gray-200"
            )}
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
