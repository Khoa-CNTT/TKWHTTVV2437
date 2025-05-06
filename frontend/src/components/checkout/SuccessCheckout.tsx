import apiReservation from "@/api/reservation";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface IData {
  nameProperty: string;
  nameRoom: string;
  imageProperty: string;
  totalPrice: string;
  startDay: string;
  endDay: string;
}

const SuccessCheckout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("status") === "success";
  const id = searchParams.get("id");
  const [show, setShow] = useState(false);
  const [data, setData] = useState<IData | null>(null);
  const handleGetDetail = async () => {
    if (id) {
      const res = await apiReservation.detailReservationOfUser(id);
      console.log("res,id ", res);
      if (res?.status === "OK") {
        setData({
          nameProperty: res?.data?.rooms?.property?.name,
          nameRoom: res?.data?.rooms?.name,
          imageProperty: res?.data?.rooms?.property?.images[0]?.image,
          totalPrice: res?.data?.totalPrice,
          startDay: res?.data?.checkIndate,
          endDay: res?.data?.checkOutdate,
        });
      }
    }
  };

  console.log("datascsc ", data);
  useEffect(() => {
    handleGetDetail();
  }, [id]);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);
  if (!show) return null;

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <h1 className="text-2xl font-bold">
          Kỳ nghĩ dưỡng của bạn đã hoàn thành
        </h1>
        <p className="text-[-16] text-[text] italic">
          Chúc bạn có một chuyến đi vui vẻ
        </p>

        <div className="p-4 border border-gray-300 w-2/3 rounded-2xl bg-yellow-50">
          <div className="flex">
            <img
              src={data?.imageProperty || ""}
              className="w-48 h-40 object-cover rounded-2xl"
            />
            <div className="flex flex-col ml-6 py-1">
              <div className="flex flex-col  flex-grow  h-28 gap-2 ">
                <h3 className="font-semibold">{data?.nameProperty || ""}</h3>
                <div className="flex text-[-14]">
                  <span>Loại phòng: </span>
                  <h3 className=" font-semibold">{data?.nameRoom}</h3>
                </div>

                <p className="text-sm text-gray-600">
                  {dayjs(data?.startDay).format("D [tháng] M")} –{" "}
                  {dayjs(data?.endDay).format("D [tháng] M")}
                </p>
              </div>

              <div className="text-lg font-bold ">
                {Number(data?.totalPrice).toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-28">
          <button
            className="text-[text] flex items-center gap-1 bg-gray-200 px-5 py-2 rounded-3xl mt-8 hover:bg-gray-300 transition duration-300 ease-in-out "
            onClick={() => {
              router.push("/");
            }}
          >
            Trang Home
          </button>{" "}
          <button
            className="text-white font-semibold bg-blue-600 px-16 py-3 rounded-3xl mt-8 hover:bg-blue-700 transition duration-300 ease-in-out"
            onClick={() => {
              router.push(`/mytrip/detail/${id}`);
            }}
          >
            Thông tin chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessCheckout;
