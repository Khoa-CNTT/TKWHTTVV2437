"use client";

import { useEffect, useState } from "react";
import InforRoomCheckout from "@/components/checkout/InforRoomCheckout";
import ContentCheckout from "@/components/checkout/ContentCheckout";
import { useCheckoutContext } from "@/app/contexts/CheckoutContext";
import apisRoom from "@/apis/room";
import { IRoom } from "@/app/types/room";

const CheckoutPage = () => {
  const { roomId } = useCheckoutContext(); // Lấy hàm setRoomId từ context

  const [room, setRoom] = useState<IRoom | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const roomData = await apisRoom.getRoomById(String(roomId));

      if (roomData.data) {
        setRoom(roomData.data);
      }
    };

    fetchRoom();
  }, [roomId]);

  return (
    <div className="flex w-[1150px] mx-auto pt-10 gap-8 min-h-screen">
      <div className="w-[60%]">
        <ContentCheckout room={room} />
      </div>

      <div className="w-[40%]">
        <InforRoomCheckout room={room} />
      </div>
    </div>
  );
};

export default CheckoutPage;
