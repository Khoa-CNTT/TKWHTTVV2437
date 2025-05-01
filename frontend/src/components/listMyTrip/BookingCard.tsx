"use client";

import { useRouter } from "next/navigation";

const BookingCard = () => {
  const router = useRouter();
  const handleNavigateDetail = () => {
    router.push("/mytrip/detail/2");
  };
  return (
    <div onClick={handleNavigateDetail}>
      <div className="border cursor-pointer rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden w-full hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition">
        <div className="flex p-8 items-start">
          {/* Ảnh */}
          <div className="w-30 h-28 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src="https://vcdn1-dulich.vnecdn.net/2022/06/01/Hoi-An-VnExpress-5851-16488048-4863-2250-1654057244.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2ea_f0O7kgGZllKmJF92g"
              alt="Hotel"
              width={112}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nội dung */}
          <div className="flex flex-col justify-between flex-grow ml-6 h-28 py-1">
            <h3 className="text-lg font-semibold">Calla Hotel</h3>
            <div>
              <p className="text-sm text-gray-600">
                19 tháng 6 – 20 tháng 6 · Hội An · Miễn phí hủy phòng
              </p>
            </div>
            <p className="text-sm text-green-600 font-medium">Đã xác nhận</p>
          </div>

          {/* Giá tiền */}
          <div className="flex items-center ml-4 ">
            <div className="flex flex-col justify-between h-28 items-end">
              <div className="text-lg font-bold whitespace-nowrap">
                VND 653.400
              </div>
              <p className="text-[-16] font-semibold">
                Thời gian đặt: <span>25/12/2025</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingCard;
