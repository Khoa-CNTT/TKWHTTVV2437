import InforRoomCheckout from "@/components/checkout/InforRoomCheckout";
import ContentCheckout from "@/components/checkout/ContentCheckout";

const CheckoutPage = () => {
  return (
    <div className="flex w-[1150px] mx-auto pt-10 gap-8 min-h-screen">
      <div className="w-[60%]">
        <ContentCheckout />
      </div>

      <div className="w-[40%]">
        <InforRoomCheckout />
      </div>
    </div>
  );
};

export default CheckoutPage;
