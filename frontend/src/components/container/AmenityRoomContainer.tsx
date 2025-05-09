import { FaSwimmer } from "react-icons/fa";
import { TbSmokingNo } from "react-icons/tb";
import { FaWifi } from "react-icons/fa";
import { LuCircleParking } from "react-icons/lu";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { TbBus } from "react-icons/tb";
import { MdFamilyRestroom } from "react-icons/md";
import { FaCity } from "react-icons/fa";

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
  FaCity: <FaCity />,
};

const AnmenityRoomContainer: React.FC<IProps> = ({ amenities }) => {
  return (
    <div>
      {amenities.slice(0, 6).map((item: Amenity, index: number) => (
        <p key={item.icon} className="flex items-center gap-2 mt-2 text-sm">
          {iconMap[item.icon]}
          {item.name}
        </p>
      ))}
    </div>
  );
};

export default AnmenityRoomContainer;
