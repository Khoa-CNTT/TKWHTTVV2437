import { IoFastFood } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { IoBed } from "react-icons/io5";
import { FaCity } from "react-icons/fa";
import AmenityRoomContainer from "./amenityRoomContainer";
import { IImage } from "@/app/types/property";

interface IProps {
  amenities: {
    icon: string; // Tên icon (key trong `iconMap`)\
    name: string; // Tên tiện ích
  }[];
  id: string;
  name: string;
  images: IImage[];
  maxPerson: number;
  price: number;
}

const ListRoomContainer: React.FC<IProps> = ({
  amenities,
  id,
  name,
  images,
  maxPerson,
  price,
}) => {
  return (
    <div className="shadow-md bg-white border-gray-300 rounded-md p-4 mt-2">
      <h2 className="mb-4 font-semibold text-lg">{name}</h2>
      <div className="flex gap-4">
        <div className="w-[30%]">
          <img className="rounded-md" src={images[0]?.image}></img>

          <div>
            <div className="flex items-center gap-2 mt-2">
              <IoBed size={24} />
              <p className="font-semibold">{maxPerson} Giường</p>
            </div>

            <AmenityRoomContainer amenities={amenities} />
          </div>
        </div>

        <div className="w-[80%] border-[1px] rounded-md  p-4 flex flex-col justify-between">
          <div className="flex">
            <div className="w-[70%]">
              <p className="font-semibold">Tóm tắt</p>
              <p className="flex items-center gap-2 mt-4">
                <IoFastFood size={20} />
                <span className="text-sm">Bao gồm 2 bữa sáng tuyệt vời</span>
              </p>

              <p className="flex items-center gap-2 mt-4">
                <IoFastFood size={20} />
                <span className="text-sm">Bao gồm 2 bữa sáng tuyệt vời</span>
              </p>

              <p className="flex items-center gap-2 mt-4">
                <IoFastFood size={20} />
                <span className="text-sm">Bao gồm 2 bữa sáng tuyệt vời</span>
              </p>
            </div>

            <div className="w-[30%] border-l-[1px] border-gray-300 pl-4">
              <p className="text-center font-semibold">Sức chứa</p>
              <div className="mt-4 flex items-center gap-2 justify-center">
                {Array(maxPerson)
                  .fill(0)
                  .map((_, index) => (
                    <IoPersonSharp key={index} size={20} />
                  ))}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <p className="font-semibold text-md">
              Giá:{" "}
              {price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRoomContainer;
