import Footer from "@/components/header/Footer";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="w-full flex justify-center px-6">
        <div className="w-[1260px] mt-10">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
