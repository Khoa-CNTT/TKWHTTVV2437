import type { Metadata } from "next";
import Header from "@/components/header/Header";
import SidebarHomestayOwner from "@/components/sidebar/SidebarHomestayOwner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Thông tin quản lý chủ sở hữu",
  description: "Thông tin quản lý chủ sở hữu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en">
      <div className={`font-roboto antialiased `}>
        {/* <Header /> */}
        <div className="flex w-full">
          <div className="w-[20%] min-h-screen bg-gray-100 shadow-md py-4 px-2">
            <SidebarHomestayOwner />
          </div>

          <div className="w-[80%]">
            {children} <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </div>
      </div>
    </div>
  );
}
