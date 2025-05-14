"use client";

import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import apiReservation from "@/api/reservation";
import { useAuth } from "@/app/contexts/AuthContext";
import { IReservationObject } from "@/app/types/reservation";

const ListMyTrip = () => {
  const { user } = useAuth();
  const [listReser, setListReser] = useState<IReservationObject[] | null>(null);

  const handleGetListReser = async () => {
    if (user?.id) {
      const res = await apiReservation.listReservationOfUser(user?.id);

      // setListReser(...res?.data)

      if (res?.status === "OK") {
        setListReser(res?.data?.rows);
      }
    }
  };

  useEffect(() => {
    handleGetListReser();
  }, [user]);

  console.log("123", listReser);
  return (
    <div>
      <div>
        <h1 className="text-[32px] font-semibold">Đặt chỗ và chuyến đi</h1>
        <div className="mt-4 flex flex-col gap-8">
          {listReser?.map((item: IReservationObject, index: number) => {
            return (
              <div key={index}>
                <BookingCard data={item} userId={user?.id || ""} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListMyTrip;
