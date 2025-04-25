"use client";
import { useRouter } from "next/navigation";

const SidebarHomestayOwner = () => {
  const router = useRouter();

  return (
    <div className="py-4 px-2">
      <div className="flex justify-center font-semibold text-xl">
        Trang quản lý
      </div>
      <div className="mt-4">
        <ul>
          <li className="bg-blue-800 text-white font-medium px-4 py-3 rounded-md cursor-pointer">
            Thông tin Homestay
          </li>
          <li className="font-medium px-4 py-3 rounded-md cursor-pointer">
            Quản lý phòng
          </li>
          <li className="font-medium px-4 py-3 rounded-md cursor-pointer">
            Quản lý thông tin thanh toán
          </li>
          <li
            className="font-medium px-4 py-3 rounded-md cursor-pointer"
            onClick={() => {
              router.push("/homestay/list-reservation-approve");
            }}
          >
            Danh sách cần phê duyệt
          </li>
          <li className="font-medium px-4 py-3 rounded-md cursor-pointer">
            Cài đặt
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarHomestayOwner;
