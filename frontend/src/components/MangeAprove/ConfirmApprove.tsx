"use client";
import { useState } from "react";
import InputText from "../input/InputText";
import { FaInfoCircle } from "react-icons/fa";
import { FaCalendarTimes } from "react-icons/fa";
import { useReservationContext } from "@/app/contexts/ReservationContext";
import apiReservation from "@/api/reservation";
import Swal from "sweetalert2";
interface IProps {
  handleCloseAppove?: () => void;
}
const ConfirmApprove = ({ handleCloseAppove }: IProps) => {
  const { reservation, setReservation } = useReservationContext();

  const [isOpenImage, setIsOpenImage] = useState(false);
  const handleAppove = async () => {
    const res = await apiReservation.approveReservation({
      reid: reservation?.id,
      status: "confirmed",
    });
    if (res?.status === "OK") {
      Swal.fire({
        title: "Đã phê duyệt!",
        icon: "success",
        draggable: true,
      });
      setReservation({ ...reservation, status: "confirmed" });
      handleCloseAppove?.();
    } else {
      Swal.fire({
        title: "Phê duyệt thất bại!",
        icon: "error",
        draggable: true,
      });
    }
  };
  const rejectReservation = async () => {
    const res = await apiReservation.approveReservation({
      reid: reservation?.id,
      status: "reject",
    });
    setReservation({ ...reservation, status: "reject" });
    handleCloseAppove?.();
  };

  const handleReject = async () => {
    Swal.fire({
      title: "Bạn chắc chắn không?",
      text: "Bạn muốn từ chối đơn đặt phòng này!",
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

        rejectReservation();
      }
    });
  };
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center h-screen w-screen "
      onClick={() => {
        if (isOpenImage) return;
        handleCloseAppove?.();
      }}
    >
      <div
        className="bg-white w-2/5 py-10 px-10 flex flex-col gap-4 relative my-8 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-6 text-black text-4xl hover:bg-gray-200 px-2 rounded-full"
          onClick={handleCloseAppove}
        >
          &times;
        </button>
        <h1 className="text-[30px] font-bold mt-4">Thông tin đơn đặt</h1>
        <p className="text-[18px] font-semibold leading-none mt-4">
          Thông tin phòng:
        </p>
        <div>
          Loại phòng:{" "}
          <span className="font-bold">{reservation?.loaiphong}</span>
        </div>
        <div>
          Yêu cầu:{" "}
          <span className="font-bold">
            {reservation?.deposit != 0 ? "Cọc" : "Không cọc"}
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <p className="text-[18px] font-semibold ">Thông tin khách hàng</p>

          <div className="grid grid-cols-2 gap-4">
            <InputText
              id="firstName"
              value={reservation?.firstName}
              label="First Name"
              type="text"
            />
            <InputText
              id="lastName"
              value={reservation?.lastName}
              label="Last Name"
              type="text"
            />
            <InputText
              id="email"
              value={reservation?.email}
              label="Email"
              type="text"
            />
            <InputText
              id="phone"
              value={reservation?.phone}
              label="Phone Number"
              type="text"
            />
            <InputText
              id="checkIn"
              value={reservation?.checkIn.format("DD/MM/YYYY HH:mm")}
              label="Check in"
              type="text"
            />
            <InputText
              id="checkOut"
              value={reservation?.checkOut.format("DD/MM/YYYY HH:mm")}
              label="Check out"
              type="text"
            />
            <InputText
              id="deposit"
              value={String(reservation?.deposit || 0)}
              label="Tiền đã cọc"
              type="text"
            />
            <InputText
              id="totalPrice"
              value={String(reservation?.totalPrice)}
              label="Tổng thanh toán"
              type="text"
            />
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex flex-col gap-2 w-1/2">
            <div>
              Chứng từ :
              <span className="font-bold">
                {reservation?.imageBanking ? "Đã cọc" : "Chưa cọc"}
              </span>
            </div>
            <div>
              Ngày đặt:{" "}
              <span className="font-bold">
                {reservation?.createdAt.format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-[150px] h-[40px] font-bold  cursor-pointer ">
              📁 Chứng từ
            </div>

            {reservation?.imageBanking && (
              <img
                src={reservation?.imageBanking}
                alt=""
                className="h-[120px] w-fit"
                onClick={() => setIsOpenImage(true)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-16 mt-10 justify-center ">
          {/* Phê duyệt */}
          <button
            className="flex items-center gap-2 px-8 py-2 text-green-600 font-semibold rounded-full border border-green-600 hover:bg-green-500/20 transition "
            onClick={handleAppove}
          >
            <span>✔</span>
            Phê duyệt
          </button>

          {/* Từ chối */}
          <button
            className="flex items-center gap-2 px-8 py-2 text-red-600 font-semibold rounded-full border border-red-600 hover:bg-red-500/20 transition "
            onClick={handleReject}
          >
            <span>✖</span>
            Từ chối
          </button>
        </div>
      </div>

      {isOpenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsOpenImage(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl"
            onClick={() => setIsOpenImage(false)}
          >
            &times;
          </button>
          <img
            src="https://file.hstatic.net/200000868155/file/ad_4nxd5oqymbchwzu3unzu-qggxjk53_ad1a33fa1f9b47cd862f4fc56aad7a7e_1024x1024.png"
            alt="Ảnh lớn"
            className="h-screen rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()} // để click vào ảnh không bị đóng modal
          />
        </div>
      )}
    </div>
  );
};

export default ConfirmApprove;
