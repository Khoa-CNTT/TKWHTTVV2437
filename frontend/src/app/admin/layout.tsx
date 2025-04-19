import React from "react";
import SidebarAdmin from "@/components/sidebar/SidebarAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {}
      <div className="flex w-full">
        <SidebarAdmin />
        {}
        <div className="w-[20%] min-h-screen bg-gray-100 shadow-md py-4 px-2">
          {}
        </div>

        {}
        <div className="w-[80%] p-6">{children}</div>
      </div>
    </>
  );
}