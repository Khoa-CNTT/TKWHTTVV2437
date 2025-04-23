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
}

// Tạo context với giá trị mặc định
const CheckoutContext = createContext<CheckoutType | undefined>(undefined);

// Tạo provider component
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [propertyId, setPropertyId] = useState<string | number | null>(
    localStorage.getItem("propertyId") || ""
  );
  const [startDate, setStartDate] = useState<Dayjs | null>(
    localStorage.getItem("startDate")
      ? dayjs(localStorage.getItem("startDate"))
      : dayjs(new Date())
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    localStorage.getItem("endDate")
      ? dayjs(localStorage.getItem("endDate"))
      : dayjs(new Date().setDate(new Date().getDate() + 2))
  );

  const [roomId, setRoomId] = useState<string>(
    localStorage.getItem("roomId") || ""
  );

  // Lưu giá trị vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("propertyId", propertyId as string);
  }, [propertyId]);

  useEffect(() => {
    localStorage.setItem("roomId", roomId);
  }, [roomId]);

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
