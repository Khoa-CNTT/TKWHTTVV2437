"use client";

import { useState } from "react";
import { IoTicketOutline } from "react-icons/io5";
import PayingModal from "../modal/PayingModal";

interface IProps {
  name: string;
  icon: string;
  term: number;
  price: number;
  type: number;
  description: string;
}

const iconData: { [key: string]: JSX.Element } = {
  IoTicketOutline: <IoTicketOutline size={80} />,
};

const AdvertisingItem: React.FC<IProps> = ({
  name,
  icon,
  term,
  price,
  type,
  description,
}) => {
  const [showModal, setShowModal] = useState<boolean>(true);
  return (
    <div className="relative border border-gray-300 rounded-md p-4">
      <div className="flex items-center justify-center">{iconData[icon]}</div>

      <p className="text-center font-semibold mt-2">{name}</p>
      <p className="text-gray-400 text-center text-sm font-semibold">Nạp</p>

      <p className="font-semibold text-center text-red-600 text-xl mt-2">
        {price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}
      </p>

      <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
        <li>{description}</li>
        <li>Gói có thời hạn trong vòng {term} tháng</li>
      </ul>

      <button
        onClick={() => setShowModal(true)}
        className="w-full text-white forn-semibold py-2 rounded-md hover:opacity-90 transition-all bg-red-600 mt-4"
      >
        Đăng ký
      </button>

      <div className="absolute">
        <PayingModal
          name={name}
          icon={icon}
          term={term}
          price={price}
          type={type}
          description={description}
        />
      </div>
    </div>
  );
};

export default AdvertisingItem;
