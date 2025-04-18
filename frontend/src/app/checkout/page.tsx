"use client";
import moment from "moment";
import { useEffect, useState } from "react";
import InforRoomCheckout from "@/components/checkout/InforRoomCheckout";
import ContentCheckout from "@/components/checkout/ContentCheckout";
import { useCheckoutContext } from "@/app/contexts/CheckoutContext";
import apisRoom from "@/apis/room";
import { IProperty } from "@/app/types/property";
import { IRoom } from "@/app/types/room";
import apisProperty from "@/apis/property";
import PaymentCheckout from "@/components/checkout/PaymentCheckout";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";
import SuccessCheckout from "@/components/checkout/SuccessCheckout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
interface IDataEnter {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  imageBanking: string | null;
}
const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("status") === "success";
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { propertyId, roomId, startDate, endDate } = useCheckoutContext(); // Lấy hàm setpropertyId từ context

  const [property, setProperty] = useState<IProperty | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);

  const [dataEnter, setDataEnter] = useState<IDataEnter>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    imageBanking: null,
  });

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);
  const handleStep2 = (value: object) => {
    setStep(2);
    console.log("step ", step);
    console.log("objevt: ", value);
  };

  const handleStep1 = () => {
    setStep(1);
  };

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

  const handleToISOString = (value: dayjs.Dayjs | null) => {
    const isoString = startDate?.format("DD/MM/YYYY") + "14:00";
    const dateObj = moment(isoString, "DD/MM/YYYY HH:mm").toDate();
    return dateObj.toISOString();
  };

  return (
    <div className="w-[1150px] mx-auto min-h-screen pt-10">
      {show ? (
        <SuccessCheckout />
      ) : (
        <div>
          <div className="flex items-center justify-between w-[60%] pr-6">
            <p className="text-2xl font-semibold">Begin your booking</p>
            <p className="text-gray-500">{`Bước ${step}/2`} </p>
          </div>
          <div className="flex w-[1150px] mx-auto  gap-8 min-h-screen">
            {step === 1 ? (
              <div className="w-[60%]">
                <ContentCheckout
                  property={property}
                  handleStep2={handleStep2}
                  dataEnter={dataEnter}
                  onChangeDataEnter={setDataEnter}
                />
              </div>
            ) : (
              <div className="w-[60%]">
                <PaymentCheckout
                  handleStep1={handleStep1}
                  dataEnter={dataEnter}
                  onChangeDataEnter={setDataEnter}
                  userId={user?.id}
                  startDay={handleToISOString(startDate)}
                  endDay={handleToISOString(endDate)}
                  roomId={roomId}
                />
              </div>
            )}

            <div className="w-[40%]">
              <InforRoomCheckout property={property} room={room} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
