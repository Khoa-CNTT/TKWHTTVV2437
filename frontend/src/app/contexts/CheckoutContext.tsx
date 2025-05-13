"use client";

import { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

// contexts/MyContext.tsx
import { createContext, useContext, ReactNode, useState } from "react";

// Định nghĩa kiểu cho context
interface CheckoutType {
  propertyId: string | number | null;
  setPropertyId: (propertyId: string | number | null) => void;
  startDate: Dayjs | null;
  setStartDate: (startDate: Dayjs | null) => void;
  endDate: Dayjs | null;
  setEndDate: (endDate: Dayjs | null) => void;
  roomId: string;
  setRoomId: (price: string) => void;
  reservationId: string;
  setReservationId: (reservationId: string) => void;
  codeId: string;
  setCodeId: (codeId: string) => void;
}

// Tạo context với giá trị mặc định
const CheckoutContext = createContext<CheckoutType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  // Initialize state with null or default values
  const [propertyId, setPropertyId] = useState<string | number | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()));
  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs(new Date().setDate(new Date().getDate() + 2))
  );
  const [roomId, setRoomId] = useState<string>("");
  const [reservationId, setReservationId] = useState<string>("");
  const [codeId, setCodeId] = useState<string>("");
  // Use useEffect to read from localStorage after component mounts (client-side)
  useEffect(() => {
    setPropertyId(localStorage.getItem("propertyId") || "");
    setRoomId(localStorage.getItem("roomId") || "");
    setReservationId(localStorage.getItem("reservationId") || "");
    setCodeId(localStorage.getItem("code") || "");
    const storedStartDate = localStorage.getItem("startDate");
    if (storedStartDate) {
      setStartDate(dayjs(storedStartDate));
    }

    const storedEndDate = localStorage.getItem("endDate");
    if (storedEndDate) {
      setEndDate(dayjs(storedEndDate));
    }
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (propertyId !== null) {
      localStorage.setItem("propertyId", propertyId as string);
    }
  }, [propertyId]);

  useEffect(() => {
    localStorage.setItem("roomId", roomId);
  }, [roomId]);

  useEffect(() => {
    localStorage.setItem("reservationId", reservationId);
  }, [reservationId]);
  useEffect(() => {
    localStorage.setItem("code", codeId);
  }, [codeId]);

  useEffect(() => {
    if (startDate) {
      localStorage.setItem("startDate", startDate.toISOString());
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      localStorage.setItem("endDate", endDate.toISOString());
    }
  }, [endDate]);

  return (
    <CheckoutContext.Provider
      value={{
        propertyId,
        setPropertyId,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        roomId,
        setRoomId,
        reservationId,
        setReservationId,
        codeId,
        setCodeId,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
// Hook tùy chỉnh để sử dụng context
export function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
}
