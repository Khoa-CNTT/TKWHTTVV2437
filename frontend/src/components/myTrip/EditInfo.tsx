"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import InputText from "../input/InputText";
import ButtonLogin from "../button/ButtonLogin";
import { useAuth } from "@/app/contexts/AuthContext";
import { IUser } from "@/app/types/user";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import apiUser from "@/api/user";
import Swal from "sweetalert2";
import { FaRegTrashCan } from "react-icons/fa6";
import apiPayment from "@/api/payment";
import validate from "@/utils/validateInput";
import apiReservation from "@/api/reservation";

interface IInfo {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  numberAccount: string;
  nameAccount: string;
  nameBank: string;
  imageBanking: string;
}

interface IProps {
  data: IInfo;
}
interface IInvalidField {
  name: string;
  mes: string;
}

const EditInfo = ({ data }: IProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("edit") === "info";
  const [show, setShow] = useState(false);
  const { user, setUser } = useAuth();
  const [editUser, setEditUser] = useState<IInfo | null>(null);
  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);
  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      setEditUser({ ...data });
    }
  }, [isOpen]);

  if (!show) return null;
  const closeModal = () => {
    // Xoá query khi đóng modal
    router.push(pathname);
  };

  const handleEditInfo = async () => {
    if (editUser !== null) {
      const valid = validate(
        {
          firstName: editUser.firstName,
          lastName: editUser.lastName,
          phone: editUser.phone,
          email: editUser.email,
          numberAccount: editUser.numberAccount,
          nameAccount: editUser.nameAccount,
          nameBank: editUser.nameBank,
          imageBanking: editUser.imageBanking,
        },
        setInvalidFields
      );

      if (valid === 0) {
        const result = await Swal.fire({
          title: "Bạn có chắc muốn cập nhật thông tin?",
          text: "Thao tác này sẽ ghi đè dữ liệu hiện tại.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Huỷ",
        });

        if (result.isConfirmed) {
          const res = await apiReservation.updateInfoReservation({
            ...editUser,
          });
          if (res?.status === "OK") {
            await Swal.fire({
              title: "Cập nhật thành công!",
              icon: "success",
              confirmButtonText: "OK",
            });

            router.push(pathname); // Quay về trang trước (server component)
            router.refresh(); // Refresh lại dữ liệu mới
          }
        }
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // setIsLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploadVideo");
      const res = await apiPayment.uploadImageToCloud(formData);
      console.log("okoko ", res);
      if (res?.status === 200) {
        setEditUser((prev) =>
          prev ? { ...prev, imageBanking: res?.data?.secure_url } : null
        );
      }

      // setIsLoading(false);
    }
  };
  const handleFileRemove = () => {
    setEditUser((prev) => (prev ? { ...prev, imageBanking: "" } : null));
  };
  return (
    <div>
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-white">
        <div className="p-5">
          <div
            onClick={closeModal}
            className="text-[30px] text-primary w-fit h-[70px] p-3 flex justify-center items-center rounded-lg hover:bg-blue-200 cursor-pointer"
          >
            <span>
              <IoMdArrowRoundBack />
            </span>
            <p>Quay lại</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="max-w-2/3 flex flex-col gap-10">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-[text] text-[28px] font-semibold">
                Cập nhật thông tin cá nhân của bạn
              </h1>
              <p className="text-[-14]  text-gray-500">
                Hãy đảm bảo thông tin chính xác để nhận phòng thuận tiện hơn
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-3 ">
                <h3 className="text-xl font-semibold">Thông tin cá nhân</h3>
                <div className="pr-8 border-r border-r-gray-400 flex flex-col gap-3">
                  <InputText
                    id="lastName"
                    label="Họ"
                    type="text"
                    value={editUser?.lastName || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, lastName: value } : null
                      );
                    }}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />

                  <InputText
                    id="firstName"
                    label="Tên"
                    type="text"
                    value={editUser?.firstName || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, firstName: value } : null
                      );
                    }}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />

                  <InputText
                    id="email"
                    label="Email"
                    type="text"
                    value={editUser?.email || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, email: value } : null
                      );
                    }}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />
                  <InputText
                    id="phone"
                    label="Số điện thoại"
                    type="text"
                    value={editUser?.phone || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, phone: value } : null
                      );
                    }}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />
                  <InputText
                    id="message"
                    label="Tin nhắn"
                    type="text"
                    value={editUser?.message || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, message: value } : null
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold">
                  Thông tin tài khoản ngân hàng
                </h3>
                <div className="pr-8 border-r border-r-gray-400 flex flex-col gap-3">
                  <InputText
                    id="numberAccount"
                    label="Số tài khoản"
                    type="text"
                    value={editUser?.numberAccount || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, numberAccount: value } : null
                      );
                    }}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />

                  <InputText
                    id="nameAccount"
                    label="Chủ tài khoản"
                    type="text"
                    value={editUser?.nameAccount || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, nameAccount: value } : null
                      );
                    }}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />

                  <InputText
                    id="nameBank"
                    label="Tại ngân hàng"
                    type="text"
                    value={editUser?.nameBank || ""}
                    onChange={(value) => {
                      setEditUser((prev) =>
                        prev ? { ...prev, nameBank: value } : null
                      );
                    }}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold">Chứng từ</h3>
                <label
                  htmlFor="file-upload"
                  // onClick={handleFocus}
                  className="px-4 py-2 w-[150px] font-bold bg-black text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
                >
                  📁 Chọn ảnh
                </label>
                {invalidFields?.some((el) => el.name === "imageBanking") && (
                  <p className="mt-0.5 text-[-12] text-red-600 italic">
                    {
                      invalidFields.find((el) => el.name === "imageBanking")
                        ?.mes
                    }
                  </p>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    handleFileChange(e);
                  }}
                  // onFocus={handleFocus}
                />
                {editUser?.imageBanking && (
                  <div>
                    <div className="relative w-fit">
                      <img
                        src={editUser?.imageBanking || ""}
                        alt="Xem trước"
                        className="h-[200px] object-contain rounded-lg border shadow"
                      />
                      <div
                        className="absolute top-2 right-2 px-2 py-2 rounded-[-50] bg-gray-300 hover:opacity-25 cursor-pointer"
                        onClick={handleFileRemove}
                      >
                        <FaRegTrashCan />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="mt-3 w-1/3 ">
                <ButtonLogin text="Lưu thông tin" onClick={handleEditInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInfo;
