"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import InputText from "../input/InputText";
import ButtonLogin from "../button/ButtonLogin";
import { useAuth } from "@/app/contexts/AuthContext";
import { IUser } from "@/app/types/user";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import apiUser from "@/api/user";
import Swal from "sweetalert2";

const EditBasicInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("edit") === "basic-info";
  const [show, setShow] = useState(false);
  const { user, setUser } = useAuth();
  const [editUser, setEditUser] = useState<IUser | null>();

  const genders = [
    { label: "Nữ", value: "Female" },
    { label: "Nam", value: "Male" },
    { label: "Không xác định (X)", value: "unspecified" },
    { label: "Không tiết lộ (U)", value: "undisclosed" },
  ];
  const [selectedGender, setSelectedGender] = useState<string>("");
  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (user) setEditUser(user);
  }, [user]);

  const closeModal = () => {
    // Xoá query khi đóng modal
    router.push(pathname);
  };

  const handleEditInfo = async () => {
    const token = localStorage.getItem("access_token");

    if (editUser?.id && token) {
      const res = await apiUser.updateUser(editUser?.id, token, {
        firstName: editUser?.firstName,
        lastName: editUser?.lastName,
        bio: editUser?.bio,
        gender: editUser?.gender,
        dateOfBirth: editUser.dateOfBirth
          ? dayjs(editUser.dateOfBirth).toISOString()
          : null,
      });
      if (res?.status === "OK" && res?.msg === "Update") {
        Swal.fire({
          title: "Update thành công!",
          icon: "success",
          draggable: true,
        });
        setUser({ ...editUser });
        closeModal();
      }
    }
  };
  if (!show) return null;

  return (
    <div>
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-white">
        <div className="p-5">
          <div
            onClick={closeModal}
            className="text-[30px] text-primary w-[50px] h-[50px] flex justify-center items-center rounded-[-50] hover:bg-blue-200 cursor-pointer"
          >
            <IoMdClose />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[480px] flex flex-col gap-4">
            <div className="">
              <h1 className="text-[text] text-[28px] font-semibold">
                Thông tin cá nhân
              </h1>
              <p className="text-[-14]  text-gray-500">
                Hãy đảm bảo thông tin này trùng khớp với giấy tờ tùy thân của
                bạn, như hộ chiếu hoặc giấy phép lái xe.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Họ và tên
              </p>
              <InputText
                id="firstName"
                label="First Name"
                type="text"
                value={editUser?.firstName || ""}
                onChange={(value) => {
                  setEditUser((prev) =>
                    prev ? { ...prev, firstName: value } : null
                  );
                }}
              />

              <InputText
                id="lastName"
                label="Last Name"
                type="text"
                value={editUser?.lastName || ""}
                onChange={(value) => {
                  setEditUser((prev) =>
                    prev ? { ...prev, lastName: value } : null
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">Về bạn</p>
              <div>
                <InputText
                  id="bio"
                  label="Tiểu sử"
                  type="text"
                  value={editUser?.bio || ""}
                  onChange={(value) => {
                    setEditUser((prev) =>
                      prev ? { ...prev, bio: value } : null
                    );
                  }}
                />
                {/* <div className="text-[-12] italic mx-2">
                  Giúp những người chủ nhà tương lai hiểu rõ hơn về bạn. Bạn có
                  thể chia sẻ phong cách du lịch, sở thích, mối quan tâm và
                  nhiều thứ khác.
                </div> */}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Ngày sinh
              </p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ width: "100%" }}>
                  <DatePicker
                    label="Ngày sinh"
                    sx={{ width: "100%" }} // 👈 Đây là điểm chính
                    value={
                      editUser?.dateOfBirth
                        ? dayjs(editUser?.dateOfBirth)
                        : null
                    }
                    onChange={(newValue: Dayjs | null) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, dateOfBirth: newValue } : null
                      );
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[-14] font-semibold text-gray-700 ">
                Gender
              </h3>
              {genders.map((gender) => (
                <label
                  key={gender.value}
                  className="flex items-center gap-3 cursor-pointer "
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender.value}
                    checked={
                      selectedGender === gender.value ||
                      editUser?.gender === gender.label
                    }
                    onChange={() => {
                      setSelectedGender(gender.value);
                      setEditUser((prev) =>
                        prev ? { ...prev, gender: gender.label } : null
                      );
                    }}
                    className="form-radio text-blue-600 focus:ring-blue-500 w-[20px] h-[20px]"
                  />
                  <span className="">{gender.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <ButtonLogin text="Lưu thông tin" onClick={handleEditInfo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBasicInfo;
