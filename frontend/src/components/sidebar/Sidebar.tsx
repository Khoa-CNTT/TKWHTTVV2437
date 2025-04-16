"use client";
import ButtonSidebar from "./ButtonSidebar";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FaQuestionCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const pathname = usePathname(); // ✅ Đây là URL hiện tại
  const menuSidebar = [
    {
      title: "Hồ sơ",
      label: "Cung cấp chi tiết thông tin cá nhân và liên lạc của bạn.",
      icon: <FaRegUser />,
      path: "/info",
    },
    {
      title: "Bảo mật và cài đặt",
      label: "Cập nhật email hoặc mật khẩu của bạn.",
      icon: <IoSettingsOutline />,
      path: "/security",
    },
    {
      title: "Trợ giúp và phản hồi",
      label: "Giúp đỡ khách hàng.",
      icon: <FaQuestionCircle />,
      path: "/support",
    },
  ];
  console.log(user);

  return (
    <div className="w-1/4">
      <div>
        <div className="m-3">
          <h1 className="text-[text] text-[28px] font-semibold">
            Hi, {user?.firstName}
          </h1>
          <p className="text-[-14] font-semibold text-gray-500">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {menuSidebar.map((item, index) => {
            const path = "/account" + item.path;
            const active = pathname === path;

            return (
              <div key={index}>
                <ButtonSidebar
                  title={item.title}
                  label={item.label}
                  icon={item.icon}
                  path={item.path}
                  isActive={active}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
