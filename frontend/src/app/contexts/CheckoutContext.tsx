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
  const [propertyId, setPropertyId] = useState<string | number | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [roomId, setRoomId] = useState<string>("");

  // Lấy giá trị từ localStorage khi component được mount
  useEffect(() => {
    const storedPropertyId = localStorage.getItem("propertyId");
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");
    const storedRoomId = localStorage.getItem("roomId");

    if (storedPropertyId) setPropertyId(storedPropertyId);
    if (storedStartDate) setStartDate(dayjs(storedStartDate));
    if (storedEndDate) setEndDate(dayjs(storedEndDate));
    if (storedRoomId) setRoomId(storedRoomId);
  }, []);


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
