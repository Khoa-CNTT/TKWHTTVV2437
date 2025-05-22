"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import SecurityField from "./SecurityField";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/types/user";
import dayjs, { Dayjs } from "dayjs";
import apiUser from "@/api/user";
import LoadingItem from "../loading/LoadingItem";
import LoadingEdit from "../loading/LoadingEdit";
interface IInfoUser {
  fullName?: string | null;
  dateOfBirth?: Dayjs | null;
  bio?: string | null;
  gender?: string | null;

  phone?: string | null;
  email?: string | null;
  emergencyPhone?: string | null;
  address?: string | null;
}

const SecurityUser = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {}, [user]);

  const handleEdit = async (value: string) => {
    if (user?.email) {
      setIsLoading(true);
      const respone = await apiUser.sendOtpToEmail({ email: user?.email });

      if (respone.status === "OK") {
        router.push(`/account/security?edit=${value}`);
      } else {
        console.error("Error:", respone.msg);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading && <LoadingEdit />}
      {user ? (
        <div className="flex flex-col gap-10 w-full">
          <div className="">
            <h1 className="text-[text] text-[28px] font-semibold">
              Bảo mật và cài đặt{" "}
            </h1>
          </div>

          <div className="w-full">
            <div className="w-full">
              <h1 className="text-[text] text-[24px] font-semibold">
                Đăng nhập và bảo mật
              </h1>

              <p className="text-[-14] text-[text]">
                Giữ tài khoản của bạn an toàn bằng mật khẩu an toàn và đăng xuất
                khỏi các thiết bị mà bạn không sử dụng.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <SecurityField
                title="Email"
                label={user?.email || ""}
                onClick={() => handleEdit("email")}
              />
              <SecurityField
                title="Thay đổi mật khẩu"
                label="Giúp tài khoản của bạn bảo mật hơn"
                onClick={() => handleEdit("password")}
              />
            </div>
          </div>

          <div className="">
            <div className=" flex flex-col gap-4">
              <h1 className="text-[text] text-[24px] font-semibold">
                Quản lý tài khoản của bạn
              </h1>

              <p className="text-[-14] text-[text]">
                Kiểm soát các tùy chọn khác để quản lý dữ liệu của bạn, như xóa
                tài khoản.
              </p>

              <div className="relative group w-fit">
                <button className="text-left text-primary hover:underline">
                  Xóa tài khoản của bạn
                </button>

                {user?.role === "6" && (
                  <div className="absolute left-0 top-full mt-1 hidden w-max rounded-md bg-gray-800 text-white text-sm px-2 py-1 group-hover:block z-10">
                    Người kinh doanh không thể xóa tài khoản
                  </div>
                )}
              </div>
              <p className="text-[-14] text-gray-600 font-semibold">
                Xóa vĩnh viễn tài khoản và dữ liệu của bạn khỏi HRTrabel
              </p>
            </div>
          </div>
        </div>
      ) : (
        <LoadingItem />
      )}
    </div>
  );
};
export default SecurityUser;
