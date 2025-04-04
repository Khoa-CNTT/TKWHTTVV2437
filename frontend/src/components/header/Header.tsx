"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleToggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleNavigateLogin = () => {
    router.push("/login");
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoginModalOpen(false);
    localStorage.removeItem("access_token");
    window.location.reload();
  };
  return (
    <header className="bg-white text-white p-4 shadow-md border-b-2 border-gray-200">
      <div className="w-[1260px] mx-auto flex justify-between items-center">
        <h2 className="font-bold text-[22px] text-blue-700">HRTravel</h2>
        {user ? (
          <div className="relative">
            <div
              className="flex items-center gap-3"
              onClick={handleToggleLoginModal}
            >
              <img
                src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                alt=""
                className="w-10 h-10 rounded-[-50] border-2 border-blue-700"
              />
              <p className="text-black font-semibold">Trần Văn Thịnh</p>
            </div>
            {isLoginModalOpen && (
              <div
                className="absolute right-0 top-full mt-2 bg-white  rounded-lg shadow-md w-96 z-50"
                onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào bên trong
              >
                <div className="px-4 py-10 flex flex-col justify-center items-center">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-3xl hover:bg-blue-600 w-1/3 hover:opacity-80"
                    onClick={handleLogout}
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <button
              className="text-gray-500 text-[-14] font-bold hover:text-primary"
              onClick={handleToggleLoginModal}
            >
              Sign in
            </button>

            {/* Modal đăng nhập */}
            {isLoginModalOpen && (
              <div
                className="absolute right-0 top-full mt-2 bg-white  rounded-lg shadow-md w-96 z-50"
                onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào bên trong
              >
                <div className="px-4 py-10 flex flex-col justify-center items-center">
                  <h2 className="text-[-18]  mb-4 text-black text-center">
                    You can now earn and use rewards on eligible Vacation
                    rentals.
                  </h2>
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-3xl hover:bg-blue-600 w-1/3 hover:opacity-80"
                    onClick={handleNavigateLogin} // Đóng modal khi click vào nút
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
