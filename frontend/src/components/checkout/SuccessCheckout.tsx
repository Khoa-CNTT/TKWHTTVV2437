import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SuccessCheckout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("status") === "success";
  const [show, setShow] = useState(false);

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
        <div className="flex justify-between gap-28">
          <button className="text-[text] flex items-center gap-1 bg-gray-200 px-5 py-2 rounded-3xl mt-8 hover:bg-gray-300 transition duration-300 ease-in-out ">
            Trang Home
          </button>{" "}
          <button className="text-white font-semibold bg-blue-600 px-16 py-3 rounded-3xl mt-8 hover:bg-blue-700 transition duration-300 ease-in-out">
            Thông tin đã đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessCheckout;
