"use client";

import { useState, useEffect } from "react";
import { IoTicketOutline } from "react-icons/io5";
import PayingModal from "../modal/PayingModal";

interface IProps {
  name: string;
  icon: string;
  term: number;
  price: number;
  type: number;
  description: string;
  id: string;
  advertising: { type?: number; id?: string };
  propertyId: string;
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
  id,
  advertising,
  propertyId,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="relative border border-gray-300 rounded-md p-4">
      <div className="flex items-center justify-center">{iconData[icon]}</div>

      <p className="text-center font-semibold mt-2">{name}</p>
      <p className="text-gray-400 text-center text-sm font-semibold">Nạp</p>

      <p className="font-semibold text-center text-red-600 text-xl mt-2">
        {price?.toLocaleString("it-IT", {
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
        disabled={type <= (advertising?.type || 0)}
        className={`w-full  forn-semibold py-2 rounded-md hover:opacity-90 transition-all  mt-4 ${type <= (advertising?.type || 0) ? "bg-gray-400 text-white" : "bg-red-600 cursor-pointer text-white"}`}
      >
        Đăng ký
      </button>

      {showModal && (
        <div className="absolute">
          <PayingModal
            onShowModal={setShowModal}
            id={id}
            name={name}
            icon={icon}
            term={term}
            price={price}
            type={type}
            description={description}
            propertyId={propertyId}
          />
        </div>
      )}
    </div>
  );
};

export default AdvertisingItem;
