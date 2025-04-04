import React, { useState } from "react";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";

interface IProps {
  onChangeTraveler: (adults: number, children: number) => void;
  onShowChoosePerson: (value: boolean) => void;
}

const ChooseQuantityPerson: React.FC<IProps> = ({
  onChangeTraveler,
  onShowChoosePerson,
}) => {
  // State để lưu số lượng người lớn và trẻ em
  const [adults, setAdults] = useState<number>(2); // Mặc định là 1 người lớn
  const [children, setChildren] = useState<number>(0); // Mặc định là 0 trẻ em

  // Hàm xử lý tăng/giảm số lượng người lớn
  const handleAdultsChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setAdults((prev) => prev + 1);
    } else if (type === "decrement" && adults > 1) {
      setAdults((prev) => prev - 1);
    }
  };

  // Hàm xử lý tăng/giảm số lượng trẻ em
  const handleChildrenChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setChildren((prev) => prev + 1);
    } else if (type === "decrement" && children > 0) {
      setChildren((prev) => prev - 1);
    }
  };

  const handleClickDone = () => {
    onChangeTraveler(adults, children);
    onShowChoosePerson(false);
  };

  return (
    <div className="bg-white w-[350px] rounded-md shadow-md p-4">
      <h2 className="font-semibold text-xl">Travelers</h2>

      {/* Người lớn */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-gray-700 font-semibold">Người lớn</p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAdultsChange("decrement")}
            disabled={adults <= 1} // Không cho giảm dưới 1
          >
            <CiCircleMinus
              className={`${adults <= 1 ? "text-gray-300" : "text-gray-500"}`}
              size={35}
            />
          </button>
          <span className="text-md">{adults}</span>
          <button onClick={() => handleAdultsChange("increment")}>
            <CiCirclePlus className="text-gray-500" size={35} />
          </button>
        </div>
      </div>

      {/* Trẻ em */}
      <div className="flex justify-between items-center mt-3">
        <div>
          <p className="text-sm text-gray-700 font-semibold">Trẻ em</p>
          <p className="text-[11px] text-gray-500">Từ 1 đến 17 tuổi</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleChildrenChange("decrement")}
            disabled={children <= 0} // Không cho giảm dưới 0
          >
            <CiCircleMinus
              className={`${children <= 0 ? "text-gray-300" : "text-gray-500"}`}
              size={35}
            />
          </button>
          <span className="text-md">{children}</span>
          <button onClick={() => handleChildrenChange("increment")}>
            <CiCirclePlus className="text-gray-500" size={35} />
          </button>
        </div>
      </div>

      <button
        onClick={handleClickDone}
        className="bg-blue-600 mt-5 w-full text-white font-semibold py-2 rounded-3xl"
      >
        Xong
      </button>
    </div>
  );
};

export default ChooseQuantityPerson;
