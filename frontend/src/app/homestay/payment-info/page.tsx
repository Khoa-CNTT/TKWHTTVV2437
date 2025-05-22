"use client";
import { CiCirclePlus } from "react-icons/ci";
import { BsBank } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import AddInfoPayment from "@/components/paymenInfo/AddInfoPayment";
import apiPayment from "@/api/payment";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditInfoPayment from "@/components/paymenInfo/EditInfoPayment";
import LoadingItem from "@/components/loading/LoadingItem";
import { Suspense } from "react";

interface IInfoPayment {
  numberAccount: string;
  nameAccount: string;
  nameBank: string;
  qrCode: string;
  id?: string;
}
const PaymentInfo = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("action") === "add-info-payment";
  const isOpenEdit = searchParams.get("action") === "edit-info-payment";
  const [isLoadingItem, setIsLoadingItem] = useState<boolean>(false);
  const handleAddInfoPayment = (value: string) => {
    router.push(`?action=${value}`);
  };
  const { user } = useAuth();
  const [infoPayment, setInfoPayment] = useState<IInfoPayment | null>(null);
  const [deleted, setDeleted] = useState(false);
  const handleGetInfoAccountPayment = async () => {
    if (user) {
      setIsLoadingItem(true);
      const res = await apiPayment.infoAccountPayment(user?.id);
      if (res?.status === "OK")
        setInfoPayment({
          numberAccount: res?.data?.numberAccount,
          nameAccount: res?.data?.nameAccount,
          nameBank: res?.data?.nameBank,
          qrCode: res?.data?.qrCode,
          id: res?.data?.id,
        });
      setIsLoadingItem(false);
    }
  };

  useEffect(() => {
    handleGetInfoAccountPayment();
  }, [isOpen, user, deleted, isOpenEdit]);

  const handleDeleteAccountPayment = async () => {
    setIsLoadingItem(true);
    const token = localStorage.getItem("access_token");
    if (token && infoPayment?.id) {
      const res = await apiPayment.deleteAccountPayment(infoPayment?.id, token);
      setInfoPayment(null);
      setDeleted(!deleted);
    }
    setIsLoadingItem(false);
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Bạn chắc chắn không?",
      text: "Bạn muốn xóa tài khoản ngân hàng này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Đã xóa!",
          text: "Bạn đã xóa thành công",
          icon: "success",
        });

        handleDeleteAccountPayment();
      }
    });
  };
  return (
    <div className="w-full">
      <div className="w-2/3">
        <div className="p-10 flex flex-col gap-4">
          <h1 className="text-2xl font-bold ">
            Quản lí thông tin tài khoản thụ hưởng của bạn
          </h1>
          <p className="p-2 border border-red-500 rounded-xl text-red-500">
            Lưu ý: Thông tin tài khoản thụ hưởng của bạn phải trùng với thông
            tin trong hợp đồng, nếu không mọi trách nhiệm rủi ro sẽ là của bạn.
          </p>
          {isLoadingItem && <LoadingItem />}
          {infoPayment ? (
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[-20] font-semibold">
                    <BsBank />
                  </span>
                  <p className="font-semibold">Tài khoản ngân hàng</p>
                </div>
                <div>
                  <div
                    className="inline-flex items-center justify-center p-2 bg-red-500 rounded-xl gap-1 text-white font-bold cursor-pointer"
                    onClick={handleDelete}
                  >
                    <IoTrashOutline className="w-4 h-4" />
                    <span className="text-sm">Xóa</span>
                  </div>
                  <div
                    className="inline-flex items-center justify-center p-2 bg-green-800 rounded-xl gap-1 text-white font-bold ml-4 cursor-pointer"
                    onClick={() => {
                      handleAddInfoPayment("edit-info-payment");
                    }}
                  >
                    <MdEdit className="w-4 h-4" />
                    <span className="text-sm">Chỉnh sửa</span>
                  </div>
                </div>
              </div>

              <div className="w-full px-8 py-4 bg-gray-100 rounded-xl mt-5">
                <div className="flex p-3 border-b border-gray-400">
                  <h1 className="w-1/3 text-gray-500 text-[-14] font-semibold ">
                    Số tài khoản
                  </h1>
                  <p className="font-semibold ">{infoPayment?.numberAccount}</p>
                </div>
                <div className="flex p-3 border-b border-gray-400">
                  <h1 className="w-1/3 text-gray-500 text-[-14] font-semibold">
                    Chủ sở hữu
                  </h1>
                  <p className="font-semibold ">{infoPayment?.nameAccount}</p>
                </div>
                <div className="flex p-3 border-b border-gray-400">
                  <h1 className="w-1/3 text-gray-500 text-[-14] font-semibold">
                    Ngân hàng thụ hưởng
                  </h1>
                  <p className="font-semibold ">{infoPayment?.nameBank}</p>
                </div>
                <div className="flex p-3 ">
                  <h1 className="w-1/3 text-gray-500 text-[-14] font-semibold">
                    Mã qr code
                  </h1>
                  <div>
                    <img
                      src={infoPayment?.qrCode}
                      alt="qrCode"
                      className="h-[200px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="mt-4 p-2 rounded-lg bg-primary text-white font-semibold w-fit flex items-center justify-center gap-2 hover:cursor-pointer"
              onClick={() => {
                handleAddInfoPayment("add-info-payment");
              }}
            >
              <span>
                <CiCirclePlus fontSize="20px" />
              </span>
              Thêm tài khoản ngân hàng
            </button>
          )}
        </div>
      </div>
      {isOpen && <AddInfoPayment />}
      {isOpenEdit && <EditInfoPayment data={infoPayment} />}
    </div>
  );
};

// Component chính
const PaymentInforPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentInfo />
    </Suspense>
  );
};

export default PaymentInforPage;
