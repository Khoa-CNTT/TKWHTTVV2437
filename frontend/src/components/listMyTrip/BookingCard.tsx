"use client";

import { IReservationObject } from "@/app/types/reservation";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { GrFormNext } from "react-icons/gr";

interface IProps {
  data: IReservationObject;
}

const BookingCard = ({ data }: IProps) => {
  const router = useRouter();

  console.log("data ", data);
  const handleNavigateDetail = (id: string) => {
    router.push(`/mytrip/detail/${id}`);
  };

  const getStatusText = (status: string | undefined): string => {
    switch (status) {
      case "waiting":
        return "Đang chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "reject":
        return "Đã từ chối và hoàn tiền";
      case "refund":
        return "Đã hoàn tiền";
      default:
        return "Không rõ trạng thái";
    }
  };
  return (
    <div onClick={() => handleNavigateDetail(data?.id)}>
      <div className="border cursor-pointer rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden w-full hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition">
        <div className="flex p-8 items-start">
          {/* Ảnh */}
          <div className="w-30 h-28 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={
                (data?.rooms?.property?.images &&
                  data?.rooms?.property?.images[0]?.image) ||
                "123213"
              }
              alt="Hotel"
              width={112}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nội dung */}
          <div className="flex flex-col justify-between flex-grow ml-6 h-28 py-1">
            <h3 className="text-lg font-semibold">
              {data?.rooms?.property?.name}
            </h3>
            <div>
              <p className="text-sm text-gray-600">
                {dayjs(data?.checkIndate).format("D [tháng] M")} –{" "}
                {dayjs(data?.checkOutdate).format("D [tháng] M")} ·{" "}
                {data?.rooms?.property?.propertyAddress?.city} · Miễn phí hủy
                phòng
              </p>
            </div>
            <div className="flex items-center gap-1 text-[-14]">
              <p
                className={`text-green-600 ${data?.statusUser === "canceled" && "text-red-600"} `}
              >
                {data?.statusUser === "created" ? "Đã đặt" : "Đã hủy"}
              </p>
              <span className="text-green-600 text-4xl flex items-center">
                <GrFormNext />
              </span>
              <p
                className={`   ${data?.status === "waiting" ? "text-black" : "text-green-600"}`}
              >
                {getStatusText(data?.status)}
              </p>
            </div>
          </div>

          {/* Giá tiền */}
          <div className="flex items-center ml-4 ">
            <div className="flex flex-col justify-between h-28 items-end">
              <div className="text-lg font-bold whitespace-nowrap">
                {Number(data?.totalPrice).toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
              {/* <p className="text-[-16] font-semibold">
                Mã xác nhận: <span>{data?.code}</span>
              </p> */}
              <p className="text-[-16] font-semibold">
                Thời gian đặt:{" "}
                <span>
                  {dayjs(data?.createdAt).format("[ngày] D [tháng] M, YYYY")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingCard;
