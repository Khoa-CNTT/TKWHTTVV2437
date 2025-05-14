import apisCommissionPayment from "@/apis/commissionPayment";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import apisPayment from "@/apis/payment";

interface IProps {
  onShowModal: (value: boolean) => void;
  month: number;
  year: number;
  evenue: number;
  rateCommission: number;
  quantity: number;
  amount: number;
  userId: string;
  id: string;
}

const PayingCommissionModal: React.FC<IProps> = ({
  onShowModal,
  month,
  year,
  evenue,
  rateCommission,
  quantity,
  amount,
  userId,
  id,
}) => {
  const handleSubmitPayment = async () => {
    try {
      await apisCommissionPayment.updateCommissionPayment(id, {
        userId,
      });

      const response = await apisPayment.createUrlPaymentCommission({
        amount: amount,
        orderId: id,
      });

      if (response.success) {
        console.log("response", response);
        // Chuyển hướng người dùng đến URL thanh toán
        window.location.href = response.data.vnpUrl;
      } else {
        toast.error("Thanh toán thất bại");
        console.error("Thanh toán thất bại");
      }
    } catch (error) {
      toast.error("Đã có lỗi trong quá trình thanh toán");
      console.error("Đã có lỗi trong quá trình thanh toán:", error);
    }
  };
  return (
    <div className="fixed w-creeen h-screen z-10 inset-0 flex items-center justify-center bg-overblack ">
      <div className="bg-white w-[500px] rounded-md shadow-lg p-4 flex flex-col text-black">
        <div className="flex items-center gap-4">
          <IoMdClose
            onClick={() => onShowModal(false)}
            className="text-blue-800 hover:bg-blue-200 rounded-full cursor-pointer"
            size={27}
          />

          <p className="font-semibold">
            Thông tin thanh toán tiên hoa hông tháng {month}/{year}
          </p>
        </div>

        <ul className="w-[80%] mx-auto border border-gray-300 py-4 px-8 rounded-md mt-6">
          <li className="mt-2">
            <div className="flex items-center justify-between">
              <p>Doanh thu của tháng:</p>
              <p className="text-semibold">
                {evenue?.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p>Số lượng đơn đặt:</p>
              <p className="text-semibold">{quantity}</p>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p>Phí tháng 4 ({rateCommission}%):</p>
              <p className="text-semibold">
                {amount?.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          </li>
        </ul>

        <div className="mt-6 px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm">Tổng thanh toán</p>
            <p className="text-lg text-red-600 font-semibold">
              {amount?.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
          <button
            onClick={handleSubmitPayment}
            className="mt-3 w-full text-white bg-red-600 py-2 rounded-md hover:opacity-90"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayingCommissionModal;
