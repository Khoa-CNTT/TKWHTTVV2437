"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import InputText from "../input/InputText";
import ButtonLogin from "../button/ButtonLogin";
import { useAuth } from "@/app/contexts/AuthContext";
import { IUser } from "@/app/types/user";
import * as React from "react";
import { FaRegTrashCan } from "react-icons/fa6";

import apiUser from "@/api/user";
import Swal from "sweetalert2";
import { TextField } from "@mui/material";
import apiPayment from "@/api/payment";
import validate from "@/utils/validateInput";
import LoadingEdit from "../loading/LoadingEdit";
import LoadingItem from "../loading/LoadingItem";

interface IInfoPayment {
  numberAccount: string;
  nameAccount: string;
  nameBank: string;
  qrCode: string;
  id?: string;
}
interface IInvalidField {
  name: string;
  mes: string;
}

interface IEditData {
  data: IInfoPayment | null;
}

const EditInfoPayment = ({ data }: IEditData) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { user, setUser } = useAuth();
  const [editUser, setEditUser] = useState<IUser | null>();
  const [dataPayment, setDataPayment] = useState<IInfoPayment>({
    numberAccount: "",
    nameAccount: "",
    nameBank: "",
    qrCode: "",
    id: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingImg, setIsLoadingImg] = useState<boolean>(false);
  const imgRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setDataPayment({
      numberAccount: data?.numberAccount || "",
      nameAccount: data?.nameAccount || "",
      nameBank: data?.nameBank || "",
      qrCode: data?.qrCode || "",
      id: data?.id || "",
    });
  }, [data]);
  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);
  const closeModal = () => {
    // Xoá query khi đóng modal
    router.push(pathname);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoadingImg(true);
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploadVideo");
      const res = await apiPayment.uploadImageToCloud(formData);
      console.log("okoko ", res);
      if (res?.status === 200) {
        setDataPayment((prev) => ({
          ...prev,
          qrCode: res?.data?.secure_url,
        }));
      }
    }
    setIsLoadingImg(false);
  };
  const handleFileRemove = () => {
    setDataPayment((prev) => ({
      ...prev,
      qrCode: "",
    }));
    if (imgRef?.current) {
      imgRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const valid = validate(
      {
        numberAccount: dataPayment.numberAccount,
        nameAccount: dataPayment.nameAccount,
        nameBank: dataPayment.nameBank,
        qrCode: dataPayment.qrCode,
      },
      setInvalidFields
    );

    if (valid === 0) {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (token && dataPayment?.id) {
        const res = await apiPayment.updateAccountPayment(
          token,
          dataPayment?.id,
          {
            numberAccount: dataPayment.numberAccount,
            nameAccount: dataPayment.nameAccount,
            nameBank: dataPayment.nameBank,
            qrCode: dataPayment.qrCode,
          }
        );
        if (res?.status === "OK") {
          Swal.fire({
            title: "Cập nhật thông tin tài khoản ngân hàng thành công!",
            icon: "success",
            allowOutsideClick: true,
            allowEscapeKey: true,
            allowEnterKey: true,
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });

          closeModal();
        } else {
          Swal.fire(
            "Thất bại",
            "Cật nhật thông tin không thành công!",
            "error"
          );
        }
      }
      setIsLoading(false);
    }
  };

  const handleFocus = () => {
    setInvalidFields([]);
  };

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
                Cập nhật tài khoản ngân hàng
              </h1>
              <p className="text-[-14]  text-gray-500">
                Hãy đảm bảo thông tin này trùng khớp với thông tin thẻ tài khoản
                ngân hàng của bạn để tránh rủi ro.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Số tài khoản
              </p>
              <div>
                <TextField
                  className="w-full"
                  id="filled-basic"
                  label="Số tài khoản"
                  variant="outlined"
                  value={dataPayment?.numberAccount}
                  placeholder="VD: 123456789"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDataPayment((prev) => ({
                      ...prev,
                      numberAccount: event.target.value,
                    }));
                  }}
                  onFocus={handleFocus}
                />
                {invalidFields?.some((el) => el.name === "nameAccount") && (
                  <p className="mt-0.5 text-[-12] text-red-600 italic">
                    {invalidFields.find((el) => el.name === "nameAccount")?.mes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Chủ sở hữu
              </p>
              <div>
                <TextField
                  className="w-full"
                  id="filled-basic"
                  label="Chủ sở hữu"
                  variant="outlined"
                  value={dataPayment.nameAccount}
                  placeholder="VD: Nguyễn Văn A"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDataPayment((prev) => ({
                      ...prev,
                      nameAccount: event.target.value,
                    }));
                  }}
                  onFocus={handleFocus}
                />
                {invalidFields?.some((el) => el.name === "nameAccount") && (
                  <p className="mt-0.5 text-[-12] text-red-600 italic">
                    {invalidFields.find((el) => el.name === "nameAccount")?.mes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Tên ngân hàng
              </p>
              <div>
                <TextField
                  className="w-full"
                  id="filled-basic"
                  label="Tên ngân hàng"
                  variant="outlined"
                  value={dataPayment.nameBank}
                  placeholder="VD: Ngân hàng kỹ thương việt nam Techcombank (TCB)"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDataPayment((prev) => ({
                      ...prev,
                      nameBank: event.target.value,
                    }));
                  }}
                  onFocus={handleFocus}
                />
                {invalidFields?.some((el) => el.name === "nameBank") && (
                  <p className="mt-0.5 text-[-12] text-red-600 italic">
                    {invalidFields.find((el) => el.name === "nameBank")?.mes}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Update mã QR tài khoản ngân hàng:{" "}
              </p>
              <label
                htmlFor="file-upload"
                onClick={handleFocus}
                className="px-4 py-2 w-[150px] font-bold bg-black text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
              >
                📁 Chọn ảnh
              </label>

              <input
                ref={imgRef}
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                className="hidden"
                onChange={(e) => {
                  handleFileChange(e);
                }}
                onFocus={handleFocus}
              />

              {isLoadingImg && (
                <div className="flex items-center justify-center w-[200px] h-[200px]">
                  <LoadingItem />
                </div>
              )}
              {dataPayment?.qrCode && (
                <div>
                  <div className="relative w-fit">
                    <img
                      src={dataPayment?.qrCode}
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
              {invalidFields?.some((el) => el.name === "qrCode") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "qrCode")?.mes}
                </p>
              )}
            </div>

            <div className="mt-3">
              <ButtonLogin text="Cập nhật thông tin" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInfoPayment;
