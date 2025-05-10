"use client";

import { Suspense } from "react";
import EditAddressInfo from "@/components/editBasicInfo/EditAddressInfo";
import EditBasicInfo from "@/components/editBasicInfo/EditBasicInfo";
import InfoUser from "@/components/infoUser/InfoUser";

const InfoContent = () => {
  return (
    <div className="w-full">
      <InfoUser />
      <EditBasicInfo />
      <EditAddressInfo />
    </div>
  );
};

const InfoPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoContent />
    </Suspense>
  );
};

export default InfoPage;
