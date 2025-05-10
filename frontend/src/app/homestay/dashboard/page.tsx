"use client";

import { Suspense } from "react";
import DashboardOwner from "@/components/content/DashboardOwner";

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardOwner />
    </Suspense>
  );
};

export default DashboardPage;
