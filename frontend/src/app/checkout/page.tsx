"use client";

import { useEffect, useState } from "react";
import InforRoomCheckout from "@/components/checkout/InforRoomCheckout";
import ContentCheckout from "@/components/checkout/ContentCheckout";
import { useCheckoutContext } from "@/app/contexts/CheckoutContext";
import apisRoom from "@/apis/room";
import { IProperty } from "@/app/types/property";
import { IRoom } from "@/app/types/room";
import apisProperty from "@/apis/property";

const CheckoutPage = () => {
  const { propertyId, roomId } = useCheckoutContext(); // Lấy hàm setpropertyId từ context

  const [property, setProperty] = useState<IProperty | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const propertyData = await apisProperty.getPropertyById(
        String(propertyId)
      );

      if (propertyData.data) {
        setProperty(propertyData.data);
      }
    };

    const fetchDataRoom = async () => {
      const roomData = await apisRoom.getDetailById(String(roomId));

      if (roomData.data) {
        setRoom(roomData.data);
      }
    };

    fetchProperty();
    fetchDataRoom();
  }, [roomId, propertyId]);

  return (
    <div className="flex w-[1150px] mx-auto pt-10 gap-8 min-h-screen">
      <div className="w-[60%]">
        <ContentCheckout property={property} />
      </div>

      <div className="w-[40%]">
        <InforRoomCheckout property={property} room={room} />
      </div>
    </div>
  );
};

export default CheckoutPage;
