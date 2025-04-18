import apiReservation from "@/api/reservation";
import { useRouter } from "next/navigation";
import PreviousMap_ from "postcss/lib/previous-map";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
interface IDataEnter {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  imageBanking: string | null;
}
interface IProps {
  handleStep1: () => void;
  dataEnter: IDataEnter;
  onChangeDataEnter: (
    newData: IDataEnter | ((prev: IDataEnter) => IDataEnter)
  ) => void;
  userId?: string;
  startDay?: string;
  endDay?: string;
  roomId: string;
}

const PaymentCheckout = ({
  handleStep1,
  dataEnter,
  onChangeDataEnter,
  userId,
  startDay,
  endDay,
  roomId,
}: IProps) => {
  const router = useRouter();
  const [infoPayment, setInfoPayment] = useState<object>({
    ...dataEnter,
    userId: userId || null,
    startDay: startDay || null,
    endDay: endDay || null,
    roomId,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChangeDataEnter((prev) => ({
        ...prev,
        imageBanking: URL.createObjectURL(file),
      }));
      setInfoPayment((prev: object) => ({
        ...prev,
        imageBanking: URL.createObjectURL(file),
      }));
    }
  };

  const handleCreateResservaiton = async (data: object) => {
    const respon = await apiReservation.createReservation(data);
    console.log("res ", respon);
    if (respon?.status === "OK") {
      router.push(`/checkout?status=success`);
    } else {
      router.push(`/checkout?status=failed`);
    }
  };

  return (
    <div>
      <div className="border-[1px] border-gray-300 rounded-lg p-8 mt-4">
        <h3 className="font-semibold text-lg mb-8">
          Thanh toán cho kỳ nghĩ dưỡng của bạn
        </h3>
        <div>
          <p className="font-semibold ">Thanh toán qua internet banking</p>
          <p className="text-[text] text-[-14] m4-8 italic ">
            Bạn cần phải thanh toán và upload chứng từ ngay bây giờ.
          </p>
        </div>

        <div className="w-full">
          <div className="flex flex-col gap-3 w-full">
            <h3 className="font-semibold mt-3">
              Thông tin tài khoản ngân hàng của chủ homestay:{" "}
            </h3>

            <div className="flex flex-col gap-4 ">
              <div className="flex items-center gap-2">
                <span>
                  <FaCheckCircle />
                </span>
                <p>
                  Đơn vị thụ hưởng:{" "}
                  <span className="font-semibold">Trần Văn Thịnh</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <FaCheckCircle />
                </span>
                <p>
                  Số tài khoản:{" "}
                  <span className="font-semibold">868686868686</span>
                </p>
              </div>
              <div className="flex items-center gap-2 ">
                <span>
                  <FaCheckCircle />
                </span>
                <p>
                  Tại:{" "}
                  <span className="font-semibold">
                    Techcombank(Ngân hàng kỹ thương)
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center ">
                <img
                  src="https://khangnguyenco.vn/pub/media/magefan_blog/ma-qr-code.jpg"
                  className="w-40 h-40"
                  alt=""
                />
                <p className="mt-1 font-semibold">Mã QR tài khoản: </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="mt-1 font-semibold">
            Update chứng từ thanh toán của bạn:{" "}
          </p>
          <label
            htmlFor="file-upload"
            className="px-4 py-2 w-[150px] font-bold bg-black text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
          >
            📁 Chọn ảnh
          </label>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFileChange(e);
            }}
          />
          {dataEnter.imageBanking && (
            <img
              src={dataEnter.imageBanking}
              alt="Xem trước"
              className="w-[200px] object-cover rounded-lg border shadow"
            />
          )}
        </div>
      </div>

      <div>
        <p className="mt-6 text-sm text-gray-600">
          Nhấn và nút Quay lại để thay đổi thông tin
        </p>
        <div className="flex items-center justify-between">
          <button
            className="text-[text] flex items-center gap-1 bg-gray-200 px-5 py-2 rounded-3xl mt-8 hover:bg-gray-300 transition duration-300 ease-in-out "
            onClick={handleStep1}
          >
            <span>
              <TiArrowBack />
            </span>
            <p className="text-[-14]">Trở lại</p>
          </button>
          <button
            className="text-white font-semibold bg-blue-600 px-20 py-3 rounded-3xl mt-8 hover:bg-blue-700 transition duration-300 ease-in-out"
            onClick={() => {
              handleCreateResservaiton(infoPayment);
            }}
          >
            Hoàn tất!
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
