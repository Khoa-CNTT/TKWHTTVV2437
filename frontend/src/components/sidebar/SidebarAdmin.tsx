"use client";
import { useRouter } from "next/navigation";

const SidebarAdmin = () => {
  const router = useRouter();

  return (
    <div className="py-4 px-2">
      <div className="flex justify-center font-semibold text-xl">
        Trang quản lý Admin
      </div>
      <div className="mt-4">
        <ul>
          <li
            className="font-medium px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => router.push("/admin/dashboard")}
          >
            Dashboard
          </li>
          <li
            className="font-medium px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => router.push("/admin/users")}
          >
            Quản lý Users
          </li>
          <li
            className="font-medium px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => router.push("/admin/homestays")}
          >
            Quản lý Homestays
          </li>
          <li
            className="font-medium px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => router.push("/admin/amenities")}
          >
            Quản lý Amenities
          </li>
          <li
            className="font-medium px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => router.push("/admin/bookings")}
          >
            Quản lý Bookings
          </li>
          <li
            className="font-medium px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => router.push("/admin/payments")}
          >
            Quản lý Payments
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAdmin;