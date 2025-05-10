import { UserProvider } from "@/app/contexts/UserContext";
import SidebarAdmin from "@/components/sidebar/SidebarAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị viên",
  description: "Quản trị viên",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex w-full">
        <div className="w-[20%] min-h-screen bg-gray-100 shadow-md py-4 px-2">
          <SidebarAdmin />
        </div>
        <div className="w-[80%] p-6">{children}</div>
      </div>
    </UserProvider>
  );
}
