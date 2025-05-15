"use client";

import { useState, useEffect } from "react";
import { IReservationObject } from "@/app/types/reservation";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { GrFormNext } from "react-icons/gr";
import { MdOutlineFeedback } from "react-icons/md";
import FeedbackModal from "../modal/FeedbackModal";
import apisReview from "@/apis/review";
import moment from "moment";

interface IProps {
  data: IReservationObject;
  userId: string;
}

const BookingCard = ({ data, userId }: IProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [star, setStar] = useState(5);

  // get review by user id
  useEffect(() => {
    const getReviewByUserId = async () => {
      const response = await apisReview.getReviewByUserId({
        idUser: userId,
        idProperty: data?.rooms?.property?.id,
      });

      if (response?.status === "OK") {
        setReviewId(response?.data?.id || "");
        setStar(response?.data?.rating || 5);
        setText(response?.data?.text || "");
      }
    };
    getReviewByUserId();
  }, [data?.rooms?.property?.id, userId, showModal]);

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

              {data?.status === "confirmed" &&
                moment(data?.checkOutdate).isAfter(moment()) && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                    className="relative border border-blue-500 rounded-sm px-3 hover:bg-blue-100 cursor-pointer py-1 flex ml-4 text-blue-500 items-center gap-2"
                  >
                    <MdOutlineFeedback size={20} />
                    <span>{reviewId ? "Cập nhật đánh giá" : "Đánh giá"}</span>

                    <div className="absolute">
                      {showModal && (
                        <FeedbackModal
                          propertyId={data?.rooms?.property?.id}
                          onCloseModal={setShowModal}
                          reviewId={reviewId}
                          star={star}
                          text={text}
                        />
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Giá tiền */}
          <div className="flex items-center ml-4 ">
            <div className="flex flex-col justify-between h-28 items-end">
              <div className="text-lg font-bold whitespace-nowrap">
                {Number(data?.totalPrice)?.toLocaleString("it-IT", {
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
