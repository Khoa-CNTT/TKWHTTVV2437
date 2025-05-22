"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import InputText from "../input/InputText";
import ButtonLogin from "../button/ButtonLogin";
import { useAuth } from "@/app/contexts/AuthContext";
import { IUser } from "@/app/types/user";
import * as React from "react";

import apiUser from "@/api/user";
import Swal from "sweetalert2";
import LoadingEdit from "../loading/LoadingEdit";

const EditAddressInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("edit") === "address-info";
  const [show, setShow] = useState(false);
  const { user, setUser } = useAuth();
  const [editUser, setEditUser] = useState<IUser | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    if (editUser?.id && token) {
      const res = await apiUser.updateUser(editUser?.id, token, {
        phone: editUser?.phone,
        emergencyPhone: editUser?.emergencyPhone,
        address: editUser?.address,
      });
      if (res?.status === "OK" && res?.msg === "Update") {
        Swal.fire("Cập nhật!", "Cập nhật thông tin thành công", "success");
        setUser({ ...editUser });
        closeModal();
      } else {
        Swal.fire("Cập nhật!", "Cập nhật thông tin không thành công", "error");
      }
    }
    setIsLoading(false);
  };
  if (!show) return null;

  return (
    <div>
      {isLoading && <LoadingEdit />}
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
                Địa chỉ cá nhân
              </h1>
              <p className="text-[-14]  text-gray-500">
                Hãy đảm bảo thông tin này trùng khớp với giấy tờ tùy thân của
                bạn, như hộ chiếu hoặc giấy phép lái xe.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Số điện thoại di động
              </p>
              <InputText
                id="phone"
                label="Số điện thoại di động"
                type="text"
                value={editUser?.phone || ""}
                onChange={(value) => {
                  setEditUser((prev) =>
                    prev ? { ...prev, phone: value } : null
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">Email</p>

              <p className=" italic">
                Email bạn có thể thay đổi trong phần bảo mật
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Liên lạc khẩn cấp
              </p>
              <div>
                <InputText
                  id="emergencyPhone"
                  label="Liên lạc khẩn cấp"
                  type="text"
                  value={editUser?.emergencyPhone || ""}
                  onChange={(value) => {
                    setEditUser((prev) =>
                      prev ? { ...prev, emergencyPhone: value } : null
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">Địa chỉ</p>
              <div>
                <InputText
                  id="address"
                  label="Địa chỉ"
                  type="text"
                  value={editUser?.address || ""}
                  onChange={(value) => {
                    setEditUser((prev) =>
                      prev ? { ...prev, address: value } : null
                    );
                  }}
                />
              </div>
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

export default EditAddressInfo;
