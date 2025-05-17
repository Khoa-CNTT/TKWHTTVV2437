import apiPayment from "@/api/payment";
import apiReservation from "@/api/reservation";
import { IInfoPayment } from "@/app/types/accountPayment";
import validate from "@/utils/validateInput";
import { useRouter } from "next/navigation";
import PreviousMap_ from "postcss/lib/previous-map";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { TiArrowBack } from "react-icons/ti";
import Swal from "sweetalert2";
interface IDataEnter {
  resId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  imageBanking: string | null;
  total?: number | null;
  nameAccount: string;
  numberAccount: string;
  nameBank: string;
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
  code: string;
  propertyId: string | null | number;
  AccountPayment: IInfoPayment | null;
}
interface IInvalidField {
  name: string;
  mes: string;
}

const PaymentCheckout = ({
  handleStep1,
  dataEnter,
  onChangeDataEnter,
  userId,
  startDay,
  endDay,
  roomId,
  code,
  propertyId,
  AccountPayment,
}: IProps) => {
  const router = useRouter();
  const [infoPayment, setInfoPayment] = useState<object>({
    ...dataEnter,
    userId: userId || null,
    startDay: startDay || null,
    endDay: endDay || null,
    roomId,
    code,
    propertyId,
  });

  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploadVideo");
      const res = await apiPayment.uploadImageToCloud(formData);
      onChangeDataEnter((prev) => ({
        ...prev,
        imageBanking: res?.data?.secure_url,
      }));
      setInfoPayment((prev: object) => ({
        ...prev,
        imageBanking: res?.data?.secure_url,
      }));
    }
  };

  const handleFileRemove = () => {
    onChangeDataEnter((prev) => ({
      ...prev,
      imageBanking: "",
    }));
    setInfoPayment((prev: object) => ({
      ...prev,
      imageBanking: "",
    }));
  };

  const handleCreateResservaiton = async (data: object) => {
    const valid = validate(
      {
        imageBanking: dataEnter?.imageBanking || "",
      },
      setInvalidFields
    );
    if (valid === 0) {
      // console.log("data ", data);
      const respon = await apiReservation.createReservation(data);

      if (respon?.status === "OK") {
        router.push(`/checkout?status=success&id=${respon?.data?.id}`);
      } else {
        if (respon?.status === "ERR") {
          Swal.fire({
            title: "Hết giờ!",
            text: "Đã hết thời gian giữ phòng, vui lòng thử lại.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          router.push(`/checkout?status=failed`);
        }
      }
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
                  <span className="font-semibold">
                    {AccountPayment?.nameAccount}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <FaCheckCircle />
                </span>
                <p>
                  Số tài khoản:{" "}
                  <span className="font-semibold">
                    {AccountPayment?.numberAccount}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 ">
                <span>
                  <FaCheckCircle />
                </span>
                <p>
                  Tại:{" "}
                  <span className="font-semibold">
                    {AccountPayment?.nameBank}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 ">
                <span>
                  <FaCheckCircle />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="flex ">
                    Tin nhắn:{" "}
                    <span className="font-semibold">
                      Tên của bạn - thanh toán đơn đặt phòng - mã xác nhận
                    </span>
                  </p>

                  <p className="flex ">
                    Ví dụ:{" "}
                    <span className="font-semibold">
                      Nguyễn Văn A - thanh toán đơn đặt phòng - mã xác nhận
                      12345
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center ">
                <img
                  src={AccountPayment?.qrCode || ""}
                  className="w-40 h-40 object-contain"
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
          {invalidFields?.some((el) => el.name === "imageBanking") && (
            <p className="mt-0.5 text-[-12] text-red-600 italic">
              {invalidFields.find((el) => el.name === "imageBanking")?.mes}
            </p>
          )}

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
            <div className="relative w-fit">
              <img
                src={dataEnter.imageBanking}
                alt="Xem trước"
                className="w-[200px] object-cover rounded-lg border shadow"
              />
              <div
                className="absolute top-2 right-2 px-2 py-2 rounded-[-50] bg-gray-300 hover:opacity-25 cursor-pointer"
                onClick={handleFileRemove}
              >
                <FaRegTrashCan />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="mt-6 text-sm text-gray-600">
          Nhấn vào nút trở lại để thay đổi thông tin
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
            className="text-white font-semibold bg-blue-600 px-20 py-3 rounded-3xl mt-8 hover:bg-blue-700 transition duration-300 ease-in-out "
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
