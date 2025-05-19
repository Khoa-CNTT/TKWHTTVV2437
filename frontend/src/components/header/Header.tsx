"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import main_logo from "@/assets/images/main_icon.png";
import Image from "next/image";
import {
  CiUser,
  CiRollingSuitcase,
  CiHeart,
  CiPen,
  CiLogout,
} from "react-icons/ci";
import { GiAirplaneDeparture } from "react-icons/gi";
import Link from "next/link";
const Header = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        buttonRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsLoginModalOpen(false);
      }
    };

    if (isLoginModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoginModalOpen]);

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

    window.location.href = "/";
  };

  const handleNavagateAccount = () => {
    router.push("/account");
    setIsLoginModalOpen(false);
  };

  const handleMytrip = () => {
    router.push("/mytrip");
    setIsLoginModalOpen(false);
  };
  const handleBecomePartner = () => {
    router.push("/become-partner");
    setIsLoginModalOpen(false);
  };
  const menu = [
    {
      title: "Trở thành người kinh doanh",
      icon: <CiUser />,
      handle: handleBecomePartner,
    },
    {
      title: "Thông tin cá nhân",
      icon: <CiUser />,
      handle: handleNavagateAccount,
    },
    {
      title: "Chuyến đi của tôi",
      icon: <GiAirplaneDeparture />,
      handle: handleMytrip,
    },
    {
      title: "Đặt chuyến đi",
      icon: <CiRollingSuitcase />,
    },
    {
      title: "Đánh giá",
      icon: <CiPen />,
    },
    {
      title: "Đã lưu",
      icon: <CiHeart />,
    },
    {
      title: "Đăng xuất",
      icon: <CiLogout />,
      handle: handleLogout,
      separate: true,
    },
  ];

  return (
    <header className="bg-white text-white p-4 shadow-md border-b-2 border-gray-200 z-10">
      <div className="w-[1260px] mx-auto flex justify-between items-center">
        <Link
          href={"/"}
          className="font-bold text-[22px] text-blue-800 flex gap-2 outline-none"
        >
          <Image src={main_logo} alt="logo" width={45} height={45} />
          <h2 className="text-2xl font-bold text-blue-800 mt-2">LoveTrip</h2>
        </Link>
        {user ? (
          <div className="relative ">
            <button
              ref={buttonRef}
              className="flex items-center gap-3 text-[text] hover:text-primary"
              onClick={handleToggleLoginModal}
            >
              <img
                src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                alt=""
                className="w-10 h-10 rounded-[-50] "
              />
              <p className=" font-semibold ">{user.firstName}</p>
            </button>
            {isLoginModalOpen && (
              <div
                ref={modalRef}
                className="absolute right-0 top-full mt-2 bg-white  rounded-lg shadow-2xl w-96 z-50"
                onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào bên trong
              >
                <div className="w-full my-1 cursor-pointer text-[text]">
                  <div className="p-6 ">
                    <p className="  text-[-20] ">{"Hi, " + user.firstName}</p>
                    <p className="  text-[-14] font-semibold">{user.email}</p>
                  </div>

                  {menu.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={` hover:bg-gray-200 px-6 py-4 gap-2 ${item?.separate && "my-3 border-t border-gray-200"}`}
                        onClick={item?.handle}
                      >
                        {/* <span className="text-[-20]">{item.icon}</span> */}
                        <p className={`text-[-14] leading-none `}>
                          {item.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <button
              ref={buttonRef}
              className="text-gray-500 text-[-14] font-bold hover:text-primary "
              onClick={handleToggleLoginModal}
            >
              Đăng nhập
            </button>

            {/* Modal đăng nhập */}
            {isLoginModalOpen && (
              <div
                ref={modalRef}
                className="absolute right-0 top-full mt-2  border border-blue-100 bg-white rounded-lg  w-96 z-50"
                onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào bên trong
              >
                <div className="px-4 py-10 flex flex-col justify-center items-center">
                  <h2 className="text-[-18]  mb-4 text-black text-center">
                    Đăng nhập tài khoản của bạn để có thể trải nghiệm những điều
                    mới mẻ.
                  </h2>
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-3xl hover:bg-blue-600 w-full hover:opacity-80 text-[-14] font-bold"
                    onClick={handleNavigateLogin} // Đóng modal khi click vào nút
                  >
                    Đăng nhập or Đăng ký
                  </button>
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-3xl hover:bg-blue-600 w-full hover:opacity-80 mt-4 text-[-14] font-bold"
                    onClick={handleNavigateLogin} // Đóng modal khi click vào nút
                  >
                    Đăng nhập cho chủ sở hữu
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
