"use client";

import { Dayjs } from "dayjs";
// contexts/MyContext.tsx
import { createContext, useContext, ReactNode, useState } from "react";

// Định nghĩa kiểu cho context
interface CheckoutType {
  roomId: string | number | null;
  setRoomId: (roomId: string | number | null) => void;
  startDate: Dayjs | null;
  setStartDate: (startDate: Dayjs | null) => void;
  endDate: Dayjs | null;
  setEndDate: (endDate: Dayjs | null) => void;
  guest: number;
  setGuest: (guest: number) => void;
}

// Tạo context với giá trị mặc định
const CheckoutContext = createContext<CheckoutType | undefined>(undefined);

// Tạo provider component
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | number | null>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [guest, setGuest] = useState<number>(0);

  return (
    <CheckoutContext.Provider
      value={{
        roomId,
        setRoomId,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        guest,
        setGuest,
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
