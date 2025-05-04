import apisAdvertising from "@/apis/advertising";
import { IAdvertising } from "@/app/types/advertising";
import AdvertisingItem from "@/components/Item/AdvertisingItem";

const Advertising = async () => {
  const advertising = await apisAdvertising.getListAdvertising();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Thông tin các gói quảng cáo</h1>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {advertising.data.map((item: IAdvertising) => (
          <AdvertisingItem
            key={item.id}
            name={item.name}
            icon={item.icon}
            term={item.term}
            price={item.price}
            type={item.type}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Advertising;
