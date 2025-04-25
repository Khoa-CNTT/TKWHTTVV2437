"use client";
import { IReservation } from "../types/reservation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import dayjs, { Dayjs } from "dayjs";

// Kiểu dữ liệu Reservation

// Kiểu dữ liệu cho context
interface ReservationContextType {
  reservation: IReservation;
  setReservation: (data: IReservation) => void;
}

// Giá trị mặc định ban đầu
const defaultReservation: IReservation = {
  id: "",
  loaiphong: "",
  firstName: "",
  lastName: "",
  checkIn: dayjs(),
  checkOut: dayjs().add(1, "day"),
  totalPrice: 0,
  trangThai: "",
  ngayDat: dayjs(),
  email: "",
  phone: "",
  deposit: 0,
  createdAt: dayjs(),
  imageBanking: null,
};

// Tạo context
const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

// Provider
export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservation, setReservation] =
    useState<IReservation>(defaultReservation);

  return (
    <ReservationContext.Provider value={{ reservation, setReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

// Hook sử dụng context
export function useReservationContext() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error(
      "useReservationContext must be used within a ReservationProvider"
    );
  }
  return context;
}
