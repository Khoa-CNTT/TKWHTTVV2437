import apisAdvertising from "@/apis/advertising";
import { IAdvertising } from "@/app/types/advertising";
import MyAdvertisingItem from "@/components/Item/MyAdvertisingItem";

const Advertising = async () => {
  const advertising = await apisAdvertising.getListAdvertising();

  return (
    <div className="p-8">
      <MyAdvertisingItem advertisings={advertising.data} />
    </div>
  );
};

export default Advertising;
