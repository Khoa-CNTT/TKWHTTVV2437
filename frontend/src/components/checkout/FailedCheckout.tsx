import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { MdMapsHomeWork } from "react-icons/md";

const FailedCheckout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("status") === "failed";
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);
  if (!show) return null;
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-10 gap-8">
        {/* <span className="text-[100px] text-red-700">
          <IoWarningOutline />
        </span> */}
        <h1 className="text-2xl font-bold">
          Chúng tôi rất tiếc bạn đã đặt phòng không thành công!
        </h1>

        <div className="flex justify-between gap-28">
          <button
            className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-full shadow-md active:scale-95 transition-transform duration-100 "
            onClick={() => {
              router.push("/");
            }}
          >
            Trang chủ
            <span className="h-4 w-4 ml-2">
              <MdMapsHomeWork />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedCheckout;
