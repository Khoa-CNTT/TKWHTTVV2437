"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState } from "react";
import InfoField from "./InfoField";
import { useRouter } from "next/navigation";

interface IInfoUser {
  fullName?: string;
  dateOfBirth?: string;
  bio?: string;
  gender?: string;

  phone?: string;
  email?: string;
  emergencyPhone?: string;
  address?: string;
}

const InfoUser = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState<IInfoUser>({
    fullName: `${user?.lastName} ${user?.firstName}`,
    dateOfBirth: user?.dateOfBirth,
    bio: user?.bio,
    gender: user?.gender,

    phone: user?.phone,
    email: user?.email,
    emergencyPhone: user?.emergencyPhone,
    address: user?.address,
  });

  const handleEditInfo = () => {
    router.push(`/account/info?edit=basic-info`);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col gap-10 w-full">
        <div className="">
          <h1 className="text-[text] text-[28px] font-semibold">{`${user?.firstName} ${user?.lastName}`}</h1>
        </div>

        <div className="w-full">
          <div className="w-full">
            <div className="flex justify-between w-full">
              <h1 className="text-[text] text-[24px] font-semibold">
                Thông tin cơ bản
              </h1>
              <div
                className="text-primary font-semibold text-[14] py-2 px-2  rounded-2xl hover:bg-blue-100 cursor-pointer"
                onClick={handleEditInfo}
              >
                Chỉnh sửa
              </div>
            </div>
            <p className="text-[-14] text-[text]">
              Hãy đảm bảo thông tin này trùng khớp với ID du lịch của bạn, như
              hộ chiếu hoặc giấy phép lái xe
            </p>
          </div>

          <div className="flex flex-wrap ">
            <InfoField title="Họ tên" label={userInfo?.fullName} />
            <InfoField title="Tiểu sử" label={userInfo?.bio} />
            <InfoField title="Ngày sinh" label={userInfo?.dateOfBirth} />
            <InfoField title="Giới tính" label={userInfo?.gender} />
          </div>
        </div>

        <div className="w-full">
          <div className="w-full">
            <div className="flex justify-between w-full">
              <h1 className="text-[text] text-[24px] font-semibold">
                Thông tin liên lạc
              </h1>
              <div
                className="text-primary font-semibold text-[14] py-2 px-2  rounded-2xl hover:bg-blue-100 cursor-pointer"
                onClick={handleEditInfo}
              >
                Chỉnh sửa
              </div>
            </div>
            <p className="text-[-14] text-[text]">
              Nhận thông báo về hoạt động tài khoản và cập nhật chuyến đi bằng
              cách chia sẻ thông tin này.
            </p>
          </div>

          <div className="flex flex-wrap ">
            <InfoField title="Số điện thoại di động" label={userInfo?.phone} />
            <InfoField title="Email" label={userInfo?.email} />
            <InfoField
              title="Liên lạc khẩn cấp"
              label={userInfo?.emergencyPhone}
            />
            <InfoField title="Địa chỉ" label={userInfo?.address} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfoUser;
