"use client";

import moment from "moment";
import { useEffect, useState, Suspense } from "react";
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
import validate from "@/utils/validateInput";
import FailedCheckout from "@/components/checkout/FailedCheckout";
import apiPayment from "@/api/payment";
import { IInfoPayment } from "../types/accountPayment";

interface IDataEnter {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  imageBanking: string | null;
  total?: number | null;
  nameAccount: string;
  numberAccount: string;
  nameBank: string;
}

interface IInvalidField {
  name: string;
  mes: string;
}

const CheckoutPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
};

const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen =
    searchParams.get("status") === "success" ||
    searchParams.get("status") === "failed";
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useAuth();

  const { propertyId, roomId, startDate, endDate } = useCheckoutContext(); // Lấy hàm setpropertyId từ context

  const [property, setProperty] = useState<IProperty | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [infoPayment, setInfoPayment] = useState<IInfoPayment | null>(null);
  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);
  const [code, setCode] = useState<string>(
    Math.floor(10000 + Math.random() * 90000).toString()
  );
  const [dataEnter, setDataEnter] = useState<IDataEnter>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
    imageBanking: null,
    total: null,
    nameAccount: "",
    numberAccount: "",
    nameBank: "",
  });

  useEffect(() => {
    setDataEnter({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      message: "",
      imageBanking: null,
      total:
        startDate &&
        endDate &&
        room?.price &&
        room?.price * Math.abs(startDate?.diff(endDate, "day")),
      nameAccount: "",
      numberAccount: "",
      nameBank: "",
    });
  }, [user, room, startDate, endDate]);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  const handleStep2 = (value: object) => {
    const valid = validate(
      {
        firstName: dataEnter.firstName,
        lastName: dataEnter.lastName,
        email: dataEnter.email,
        phone: dataEnter.phone,
        nameAccount: dataEnter.nameAccount,
        numberAccount: dataEnter.numberAccount,
        nameBank: dataEnter.nameBank,
      },
      setInvalidFields
    );

    if (valid === 0) {
      setStep(2);
    }
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

  useEffect(() => {
    if (property?.idUser) {
      const fectInfoPayment = async () => {
        const res = await apiPayment.infoAccountPayment(property?.idUser);
        if (res?.data) {
          setInfoPayment(res?.data);
        }
      };

      fectInfoPayment();
    }
  }, [property]);

  const handleToISOString = (value: dayjs.Dayjs | null, status: string) => {
    let isoString;
    if (status === "startDay") {
      isoString = value?.format("DD/MM/YYYY") + "14:00";
    } else {
      isoString = value?.format("DD/MM/YYYY") + "12:00";
    }

    const dateObj = moment(isoString, "DD/MM/YYYY HH:mm").toDate();
    return dateObj.toISOString();
  };

  console.log("property ", infoPayment);
  return (
    <div className="w-[1150px] mx-auto min-h-screen pt-10">
      {show ? (
        <div>
          <SuccessCheckout />
          <FailedCheckout />
        </div>
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
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
                />
              </div>
            ) : (
              <div className="w-[60%]">
                <PaymentCheckout
                  handleStep1={handleStep1}
                  dataEnter={dataEnter}
                  onChangeDataEnter={setDataEnter}
                  userId={user?.id}
                  startDay={handleToISOString(startDate, "startDay")}
                  endDay={handleToISOString(endDate, "endDay")}
                  roomId={roomId}
                  code={code}
                  AccountPayment={infoPayment}
                  propertyId={propertyId}
                />
              </div>
            )}

            <div className="w-[40%]">
              <InforRoomCheckout property={property} room={room} code={code} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
