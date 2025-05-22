"use client";

import { FaParking, FaBusAlt } from "react-icons/fa";

import { IoIosHeartEmpty } from "react-icons/io";
import { SlPicture } from "react-icons/sl";
import { IHightlight } from "@/app/types/highlight";
import { FaKitchenSet } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";

interface IProps {
  highlights: IHightlight[];
}

// set icon map highlight
const iconMapHighlight: { [key: string]: JSX.Element } = {
  FaParking: <FaParking size={30} />,
  IoIosHeartEmpty: <IoIosHeartEmpty size={30} />,
  SlPicture: <SlPicture size={30} />,
  FaBusAlt: <FaBusAlt size={30} />,
  FaKitchenSet: <FaKitchenSet size={30} />,
  IoFastFoodOutline: <IoFastFoodOutline size={30} />,
};

const HighlightProperty: React.FC<IProps> = ({ highlights }) => {
  return (
    <div className="border-[1px] border-gray-300 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Các điểm nổi bật tại chỗ nghỉ</h3>

      {highlights?.map((item) => (
        <div key={item.id} className="flex items-center gap-3 mt-4">
          {iconMapHighlight[item.icon]}
          <div>
            <span className="text-md font-semibold">{item.name}</span>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        </div>
      ))}

      {/* <div className="flex items-center gap-3 mt-4">
        <SlPicture size={30} />
        <div>
          <span className="text-md font-semibold">Tầm nhìn</span>
          <p className="text-gray-500 text-sm">
            Ban công, Nhìn ra thành phố, Tầm nhìn ra khung cảnh
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <FaBusAlt size={30} />
        <div>
          <span className="text-md font-semibold">Dịch vụ đưa đón</span>
          <p className="text-gray-500 text-sm">Xe đưa đón sân bay</p>
        </div>
      </div> */}

      {/* <button className="w-full border-[1px] border-blue-700 text-center rounded-md py-3 text-blue-700 font-semibold flex items-center justify-center gap-3 mt-4 cursor-pointer hover:bg-blue-100 transition-all duration-200">
        <IoIosHeartEmpty size={20} className="text-blue-700" />
        <span className="text-sm">Thêm vào danh sách yêu thích</span>
      </button> */}
    </div>
  );
};

export default HighlightProperty;
