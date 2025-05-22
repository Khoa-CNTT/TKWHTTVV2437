"use client";
import { useEffect, useRef, useState } from "react";
import InputText from "../input/InputText";
import { FaInfoCircle } from "react-icons/fa";
import { FaCalendarTimes } from "react-icons/fa";
import { useReservationContext } from "@/app/contexts/ReservationContext";
import apiReservation from "@/api/reservation";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FaRegTrashCan } from "react-icons/fa6";
import apiPayment from "@/api/payment";
import { validate } from "uuid";
import LoadingEdit from "../loading/LoadingEdit";
import LoadingItem from "../loading/LoadingItem";
interface IProps {
  handleCloseAppove?: () => void;
  status: string | null;
}

const ConfirmApprove = ({ handleCloseAppove, status }: IProps) => {
  const { reservation, setReservation } = useReservationContext();
  // console.log("resv ", reservation);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [returnImgBanking, setReturnImgBanking] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [detailRes, setDetailRes] = useState<object | null>(null);
  const [reason, setReason] = useState("");
  const [reasonNoInvalid, setReasonNoInvalid] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingImg, setIsLoadingImg] = useState<boolean>(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const reasons = [
    "Không còn phòng trống",
    "Thông tin người đặt không hợp lệ",
    "Yêu cầu không phù hợp với chính sách",
    "Khách đã hủy trước",
  ];

  useEffect(() => {
    const handleDetailRes = async () => {
      const res = await apiReservation.detailReservationOfUser(reservation?.id);
      setDetailRes({ ...res?.data });
    };

    handleDetailRes();
  }, [reservation]);
  const handleAppove = async () => {
    setIsLoading(true);
    const res = await apiReservation.approveReservation({
      ...detailRes,
      reid: reservation?.id,
      status: "confirmed",
    });
    if (res?.status === "OK") {
      Swal.fire({
        title: "Đã phê duyệt!",
        icon: "success",
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      setReservation({ ...reservation, status: "confirmed" });
      handleCloseAppove?.();
    } else {
      Swal.fire({
        title: "Phê duyệt thất bại!",
        icon: "error",
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
    setIsLoading(false);
  };
  const rejectReservation = async () => {
    setIsLoading(true);
    const res = await apiReservation.approveReservation({
      ...detailRes,
      reid: reservation?.id,
      status: "reject",
      returnImgBanking: returnImgBanking,
      reason: returnImgBanking ? reason : reasonNoInvalid,
    });

    if (res?.status === "OK") {
      Swal.fire({
        title: "Đã từ chối!",
        text: "Bạn đã từ chối thành công",
        icon: "success",
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      setReservation({ ...reservation, status: "reject" });
      handleCloseAppove?.();
    } else {
      Swal.fire({
        title: "Từ chối thất bại!",
        icon: "error",
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (
      (reasonNoInvalid === "" && returnImgBanking === null && reason === "") ||
      (returnImgBanking !== null && reason === "") ||
      (returnImgBanking === null && reason !== "")
    ) {
      Swal.fire({
        title: "Thiếu chứng từ!",
        text: "Vui lòng cung cấp ảnh chứng từ hoặc tích vào ô 'Chứng từ chuyển khoản không hợp lệ' trước khi từ chối",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Bạn chắc chắn không?",
        text: "Bạn muốn từ chối đơn đặt phòng này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vâng,  từ chối!",
      }).then((result) => {
        if (result.isConfirmed) {
          rejectReservation();
        }
      });
    }
  };

  const handleRefund = async () => {
    if (
      (reasonNoInvalid === "" && returnImgBanking === null && reason === "") ||
      (returnImgBanking !== null && reason === "") ||
      (returnImgBanking === null && reason !== "")
    ) {
      Swal.fire({
        title: "Thiếu chứng từ!",
        text: "Vui lòng cung cấp ảnh chứng từ hoặc tích vào ô 'Chứng từ chuyển khoản không hợp lệ' trước khi hoàn tiền",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      setIsLoading(true);
      const res = await apiReservation.approveReservation({
        ...detailRes,
        reid: reservation?.id,
        status: "refund",
        returnImgBanking: returnImgBanking,
        reason: returnImgBanking ? reason : reasonNoInvalid,
      });

      if (res?.status === "OK") {
        Swal.fire({
          title: "Đã hoàn tiền!",
          text: "Bạn đã hoàn tiền thành công",
          icon: "success",
          allowEscapeKey: true,
          allowEnterKey: true,
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });

        setReservation({ ...reservation, status: "refund" });
        handleCloseAppove?.();
      } else {
        Swal.fire({
          title: "Hoàn tiền thất bại!",
          icon: "error",
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
        });
      }
      setIsLoading(false);
    }
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
        setReturnImgBanking(res?.data?.secure_url);
      }

      setIsLoadingImg(false);
    }
  };
  const handleFileRemove = () => {
    setReturnImgBanking(null);
    if (imgRef?.current) {
      imgRef.current.value = "";
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    setReturnImgBanking(null);
    setReason("");
    if (checked) {
      setReasonNoInvalid("Chứng từ thanh toán của bạn không hợp lệ");
    } else {
      setReasonNoInvalid("");
    }
  };
  return (
    <div>
      {isLoading && <LoadingEdit />}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-center items-center z-48 h-screen"
        onClick={() => {
          if (isOpenImage) return;
          handleCloseAppove?.();
        }}
      >
        <div
          className="bg-white w-2/5 h-full max-h-screen overflow-y-auto overflow-x-hidden pt-2 pb-10 px-10 flex flex-col gap-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-6 text-black text-4xl hover:bg-gray-200 px-2 rounded-full"
            onClick={handleCloseAppove}
          >
            &times;
          </button>
          <h1
            className={`text-[30px] font-bold mt-4 ${reservation?.statusUser === "created" ? "text-green-500" : "text-red-500"}`}
          >
            Yêu cầu {reservation?.statusUser === "created" ? "đặt" : "hủy"}{" "}
            phòng
          </h1>
          <h1 className="text-[26px] font-bold mt-4">Thông tin đơn đặt</h1>
          <p className="text-[18px] font-semibold leading-none mt-4">
            Thông tin phòng:
          </p>
          <div>
            Loại phòng:{" "}
            <span className="font-bold">{reservation?.nameRoom}</span>
          </div>
          <div>
            Mã xác nhận: <span className="font-bold">{reservation?.code}</span>
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
                value={dayjs(reservation?.checkIn).format("DD/MM/YYYY HH:mm")}
                label="Check in"
                type="text"
              />
              <InputText
                id="checkOut"
                value={dayjs(reservation?.checkOut).format("DD/MM/YYYY HH:mm")}
                label="Check out"
                type="text"
              />

              <InputText
                id="totalPrice"
                value={String(reservation?.totalPrice)}
                label="Tổng thanh toán"
                type="text"
              />

              <InputText
                id="numberAccount"
                value={reservation?.numberAccount}
                label="Số tài khoản"
                type="text"
              />
              <InputText
                id="nameAccount"
                value={reservation?.nameAccount}
                label="Chủ tài khoản"
                type="text"
              />
              <InputText
                id="nameBank"
                value={reservation?.nameBank}
                label="Ngân hàng"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm  font-semibold">Tin nhắn</label>
            <textarea
              value={reservation?.message || ""}
              readOnly
              className="w-full rounded-md border border-gray-300 px-3 py-2 resize-none focus:border-primary focus:border-2 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="flex items-start">
            <div className="flex flex-col gap-2 w-1/2">
              <div>
                Ngày đặt:{" "}
                <span className="font-bold">
                  {reservation?.createdAt.format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-[150px] h-[40px] font-bold  cursor-pointer ">
                Chứng từ
              </div>

              {reservation?.imageBanking && (
                <img
                  src={reservation?.imageBanking}
                  alt=""
                  className="h-[120px] w-[200px] object-contain"
                  onClick={() => setIsOpenImage(true)}
                />
              )}
            </div>
          </div>
          {status === null ? (
            <div className="py-2 px-4 border border-black flex flex-col gap-4 rounded-xl">
              <h1 className="font-semibold ">Cung cấp chứng từ từ chối</h1>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="invalid-transfer"
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 font-semibold"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="invalid-transfer"
                    className="text-sm text-red-700 font-medium"
                  >
                    Chứng từ chuyển khoản không hợp lệ
                  </label>
                </div>
                <p>Hoặc</p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="decline-reason" className="font-medium">
                    Lý do từ chối đặt phòng
                  </label>
                  <select
                    id="decline-reason"
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setIsChecked(false);
                      setReasonNoInvalid("");
                    }}
                    className="p-2 border rounded-md"
                  >
                    <option value="">-- Chọn lý do --</option>
                    {reasons.map((r, idx) => (
                      <option key={idx} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[-12] italic">
                  Và cung cấp chứng từ hoàn tiền
                </p>
                <label
                  htmlFor="file-upload"
                  // onClick={handleFocus}
                  className="px-4 py-2 w-[150px] font-bold bg-black text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
                >
                  📁 Chọn ảnh
                </label>
                {/* {returnImgBanking !== null && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  Cung cấp chứng từ hoàn tiền hoặc tích vào chứng từ không hợp lệ
                </p>
              )} */}
                <input
                  ref={imgRef}
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    handleFileChange(e);
                  }}
                />
                {isLoadingImg && (
                  <div className="flex items-center justify-center w-[200px] h-[200px]">
                    <LoadingItem />
                  </div>
                )}
                {returnImgBanking && (
                  <div>
                    <div className="relative w-fit">
                      <img
                        src={returnImgBanking || ""}
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
          ) : (
            <div className="py-2 px-4 border border-black flex flex-col gap-4 rounded-xl">
              <h1 className="font-semibold text-[-18]">Hành động</h1>
              <div>
                <h3 className="font-semibold">Lí do từ chối</h3>
                {reservation?.reason ? (
                  <p className="text-red-500">{reservation?.reason}</p>
                ) : (
                  <p className="text-red-500">Không có</p>
                )}
              </div>
              <div className="">
                <div className=" font-bold  cursor-pointer ">
                  Chứng từ hoàn tiền
                </div>

                {reservation?.returnImgBanking ? (
                  <img
                    src={reservation?.returnImgBanking}
                    alt=""
                    className="h-[120px] w-[200px] object-contain"
                    onClick={() => setIsOpenImage(true)}
                  />
                ) : (
                  <p className="text-red-500">Không có</p>
                )}
              </div>
            </div>
          )}
          {status === null && (
            <div className="flex gap-16 mt-10 justify-center ">
              {reservation?.statusUser === "created" ? (
                <div className="flex gap-16 justify-center ">
                  {" "}
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
              ) : (
                <button
                  className="flex items-center gap-2 px-8 py-2 text-green-600 font-semibold rounded-full border border-green-600 hover:bg-green-500/20 transition "
                  onClick={handleRefund}
                >
                  <span>✔</span>
                  Hoàn tiền
                </button>
              )}
              {/* Phê duyệt */}
            </div>
          )}
        </div>

        {isOpenImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 "
            onClick={() => setIsOpenImage(false)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl"
              onClick={() => setIsOpenImage(false)}
            >
              &times;
            </button>
            <img
              src={reservation?.imageBanking || ""}
              alt="Ảnh lớn"
              className="h-screen w-1/2 object-contain rounded-xl shadow-lg"
              onClick={(e) => e.stopPropagation()} // để click vào ảnh không bị đóng modal
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmApprove;
