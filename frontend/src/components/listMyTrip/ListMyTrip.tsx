"use client";

import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import apiReservation from "@/api/reservation";
import { useAuth } from "@/app/contexts/AuthContext";
import { IReservationObject } from "@/app/types/reservation";
import LoadingItem from "../loading/LoadingItem";

const ListMyTrip = () => {
  const { user } = useAuth();
  const [listReser, setListReser] = useState<IReservationObject[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetListReser = async () => {
    setIsLoading(true);
    if (user?.id) {
      const res = await apiReservation.listReservationOfUser(user?.id);

      // setListReser(...res?.data)

      if (res?.status === "OK") {
        setListReser(res?.data?.rows);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetListReser();
  }, [user]);

  console.log("123", listReser);
  return (
    <div>
      <div>
        <h1 className="text-[32px] font-semibold">Đặt chỗ và chuyến đi</h1>
        {isLoading && (
          <div className="flex items-center justify-center mt-4">
            <LoadingItem />
          </div>
        )}
        <div className="mt-4 flex flex-col gap-8">
          {listReser && listReser.length > 0 ? (
            listReser?.map((item: IReservationObject, index: number) => {
              return (
                <div key={index}>
                  <BookingCard data={item} userId={user?.id || ""} />
                </div>
              );
            })
          ) : (
            <div className="flex items-center mt-6">
              <img
                src="https://t-cf.bstatic.com/design-assets/assets/v3.150.0/illustrations-traveller/TripsGlobe.png"
                alt=""
                className="w-[214px] h-[260px] object-cover"
              />
              <div>
                <h1 className="text-[24px] font-semibold">Đi đâu tiếp đây?</h1>
                <p>
                  Bạn chưa có chuyến đi nào cả. Sau khi bạn đặt chỗ, đơn đó sẽ
                  xuất hiện tại đây.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMyTrip;
