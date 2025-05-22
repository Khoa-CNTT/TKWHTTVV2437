import { FaSwimmer } from "react-icons/fa";
import { TbSmokingNo } from "react-icons/tb";
import { FaWifi } from "react-icons/fa";
import { LuCircleParking } from "react-icons/lu";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { TbBus } from "react-icons/tb";
import { MdFamilyRestroom } from "react-icons/md";
import { MdTableBar } from "react-icons/md";
import { FaSpa } from "react-icons/fa";
import { GiMagicBroom } from "react-icons/gi";

interface Amenity {
  icon: string; // Tên icon (key trong `iconMap`)
  name: string; // Tên tiện ích
}

interface IProps {
  amenities: Amenity[];
}

const iconMap: { [key: string]: JSX.Element } = {
  FaSwimmer: <FaSwimmer />,
  TbSmokingNo: <TbSmokingNo />,
  FaWifi: <FaWifi />,
  LuCircleParking: <LuCircleParking />,
  FaUmbrellaBeach: <FaUmbrellaBeach />,
  MdRestaurant: <MdRestaurant />,
  TbBus: <TbBus />,
  MdFamilyRestroom: <MdFamilyRestroom />,
  MdTableBar: <MdTableBar />,
  FaSpa: <FaSpa />,
  GiMagicBroom: <GiMagicBroom />,
};

const AnmenityContainer: React.FC<IProps> = ({ amenities }) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {amenities?.map((item: Amenity, index: number) => (
        <div
          key={index}
          className="flex items-center gap-2 mt-2 text-sm font-medium"
        >
          <div className="text-green-700 text-xl ">{iconMap[item.icon]}</div>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AnmenityContainer;
