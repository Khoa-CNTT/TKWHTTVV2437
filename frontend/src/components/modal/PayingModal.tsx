"use client";

import { useEffect, useRef } from "react";
import moment from "moment";
import { IoMdClose } from "react-icons/io";
import { IoTicketOutline } from "react-icons/io5";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import iconVnpay from "../../assets/images/icon-vnpay.jpg";
import Image from "next/image";
import apisPayment from "@/apis/payment";
import { toast } from "react-toastify";
import apisAdOrder from "@/apis/adOrder";
import { useAuth } from "@/app/contexts/AuthContext";

interface IProps {
  name: string;
  icon: string;
  term: number;
  price: number;
  type: number;
  description: string;
  id: string;
  onShowModal: (value: boolean) => void;
  propertyId: string;
}

const iconData: { [key: string]: JSX.Element } = {
  IoTicketOutline: <IoTicketOutline size={40} />,
};

const PayingModal: React.FC<IProps> = ({
  name,
  icon,
  term,
  price,
  id,
  type,
  description,
  onShowModal,
  propertyId,
}) => {
  const { user } = useAuth();

  const handleSubmitPayment = async () => {
    try {
      // create order
      const order = await apisAdOrder.createAdOrder({
        amount: price,
        idAdvertising: id,
        idUser: user?.id,
        methodPay: "vnpay",
        quantity: 1,
        idProperty: propertyId,
      });

      if (order.data) {
        const response = await apisPayment.createUrlPayment({
          amount: price,
          orderId: order.data.id,
        });

        if (response.success) {
          console.log("response", response);
          // Chuyển hướng người dùng đến URL thanh toán
          window.location.href = response.data.vnpUrl;
        } else {
          toast.error("Thanh toán thất bại");
          console.error("Thanh toán thất bại");
        }
      }
    } catch (error) {
      toast.error("Đã có lỗi trong quá trình thanh toán");
      console.error("Đã có lỗi trong quá trình thanh toán:", error);
    }
  };

  return (
    <div className="fixed w-creeen h-screen z-10 inset-0 flex items-center justify-center bg-overblack ">
      <div className="bg-white w-[600px] h-[80vh] rounded-md shadow-lg p-4 flex flex-col">
        <div className="flex items-center gap-4">
          <IoMdClose
            onClick={() => onShowModal(false)}
            className="text-blue-800 hover:bg-blue-200 rounded-full cursor-pointer"
            size={27}
          />

          <p className="font-semibold">Thông tin thanh toán của {name}</p>
        </div>

        <div className="mt-6 w-[80%] mx-auto border border-gray-300 p-4 rounded-md">
          <div className="flex w-full items-center gap-3">
            {iconData[icon]}
            <div className="w-full">
              <p className="font-semibold">{name}</p>
              <div className="flex font-semibold items-center justify-between">
                <p className="text-red-600 text-sm font-semibold">
                  {price?.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <p>x1</p>
              </div>
            </div>
          </div>

          <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
            <li>{description}</li>
            <li>Gói có thời hạn trong vòng {term} tháng</li>
          </ul>
        </div>

        <div className="px-8 mt-4">
          <h3 className="font-semibold">Thời hạn</h3>
          <p className="text-sm text-gray-600">
            Gói có thời hạn trong vòng {term} tháng
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600">
              Ngày bắt đầu: {moment().format("DD/MM/YYYY")}
            </p>
            <p className="text-sm text-gray-600">
              Ngày hết hạn: {moment().add(term, "months").format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <div className="px-8 mt-4">
          <h3 className="font-semibold mb-2">Thông tin thanh toán</h3>

          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={"vnpay"}
            // onChange={handleChange}
          >
            <FormControlLabel
              value="vnpay"
              control={<Radio />}
              label={
                <div className="flex items-center gap-1">
                  <Image width={40} height={40} src={iconVnpay} alt="vnpay" />
                  <p className="font-medium">VNPay</p>
                </div>
              }
            />
            {/* <FormControlLabel value="male" control={<Radio />} label="Male" /> */}
          </RadioGroup>
        </div>

        <div className="mt-auto px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm">Tổng thanh toán</p>
            <p className="text-lg text-red-600 font-semibold">
              {price?.toLocaleString("it-IT", {
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

export default PayingModal;
