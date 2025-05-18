"use client";

import React from "react";
import ManageReservationContainer from "@/components/container/ManageReservationContainer";
import ListReservationAdmin from "@/components/adminComponent/ListReservationAdmin";

const ReservationPage: React.FC = () => {
  return (
    <div className="p-4">
      <ListReservationAdmin />
    </div>
  );
};

export default ReservationPage;
