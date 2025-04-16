import Sidebar from "@/components/sidebar/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex justify-center px-6">
      <div className="w-[1260px] flex my-6 ml-6 gap-6">
        <Sidebar />
        <div className="flex-1 h-full py-14 px-14 border border-gray-300 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
