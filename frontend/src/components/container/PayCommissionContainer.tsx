import apisCommissionPayment from "@/apis/commissionPayment";
import { useState, useEffect } from "react";
import { ICommissionPayment } from "@/app/types/commissionPayment";
import PayingCommissionModal from "../modal/PayingCommissionModal";

const propertyId = "1b61baa4-6992-4c67-bdd1-c5eec0e05570";

interface IProps {
  userId: string;
}

const PayCommissionContainer: React.FC<IProps> = ({ userId }) => {
  const [commissionPayment, setCommissionPayment] = useState<
    ICommissionPayment[]
  >([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchCommissionPayment = async () => {
      const response =
        await apisCommissionPayment.getListCommissionPaymentByPropertyId(
          propertyId
        );

      setCommissionPayment(response.data);
    };

    fetchCommissionPayment();
  }, [propertyId]);

  if (commissionPayment.length === 0) {
    return "";
  }

  return (
    <div>
      {commissionPayment.map((item) => (
        <div className="ralative border-gray-300 border rounded-md p-4 mt-4">
          <h4 className="text-center font-semibold">
            Thông tin thanh toán tiền hoa hồng tháng {item.month}/{item.year}
          </h4>

          <ul className="mt-4">
            <li className="mt-2">
              <div className="flex items-center justify-between">
                <p>Doanh thu:</p>
                <p className="text-semibold">
                  {item.totalRevenue.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p>Số lượng đơn:</p>
                <p className="text-semibold">{item.orderQuantity}</p>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p>Phí tháng 4 ({item.commissionRate}%):</p>
                <p className="text-semibold">
                  {item.commissionAmount.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </li>
          </ul>

          <div className="border-t border-gray-300 mt-2 pt-2">
            <div className="flex items-center justify-between">
              <p>Tổng tiền:</p>
              <p className="text-red-500 font-semibold">
                {item.commissionAmount.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2 text-white bg-red-600 rounded-md hover:opacity-90 mt-4"
            >
              Thanh toán
            </button>
          </div>

          {showModal && (
            <PayingCommissionModal
              month={item.month}
              year={item.year}
              evenue={item.totalRevenue}
              rateCommission={item.commissionRate}
              quantity={item.orderQuantity}
              onShowModal={setShowModal}
              amount={item.commissionAmount}
              id={item.id}
              userId={userId}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PayCommissionContainer;
