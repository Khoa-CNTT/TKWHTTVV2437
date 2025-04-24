"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { MdOutlineMapsHomeWork } from "react-icons/md";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { MdNewspaper } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

const links = [
  { href: "/homestay/information", label: "Thông tin Homestay", icon: <MdOutlineMapsHomeWork size={20} />},
  { href: "/homestay/manager-room", label: "Quản lý phòng", icon: <MdOutlineBedroomParent size={22} /> },
  { href: "/homestay/payment-info", label: "Quản lý thanh toán", icon: <FaRegCreditCard size={22} /> },
  { href: "/homestay/manage-reservation", label: "Quản lí đơn đặt phòng", icon: <MdNewspaper size={22} /> },
  { href: "/homestay/settings", label: "Cài đặt", icon: <IoSettingsOutline size={25} /> },
];

const SidebarHomestayOwner = () => {
  const pathname = usePathname();

  return (
    <div className="py-4 px-2">
      <div className="flex justify-center font-semibold text-xl">
        Trang quản lý
      </div>
      <div className="mt-4 w-full">
      {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "mt-1 text-sm font-medium px-4 py-3 rounded-md cursor-pointer block",
              pathname === link.href
                ? "bg-blue-700 text-white" // Active link styles
                : "hover:bg-gray-200"
            )}
          >
            <div className="flex items-center gap-2">
              {link.icon}
              {link.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarHomestayOwner;
