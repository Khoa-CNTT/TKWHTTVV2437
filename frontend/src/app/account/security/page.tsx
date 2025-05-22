"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import EditPassword from "@/components/securityUser/EditPassword";
import SecurityUser from "@/components/securityUser/SecurityUser";
import EditEmail from "@/components/securityUser/EditEmail";
import LoadingEdit from "@/components/loading/LoadingEdit";

const SecurityContent = () => {
  const searchParams = useSearchParams();
  const isEditPassword = searchParams.get("edit") === "password";
  const isEditEmail = searchParams.get("edit") === "email";
  return (
    <div className="w-full">
      <SecurityUser />

      {isEditPassword && <EditPassword />}
      {isEditEmail && <EditEmail />}
      {/* <EditBasicInfo />
      <EditAddressInfo /> */}
    </div>
  );
};

const SecurityPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SecurityContent />
    </Suspense>
  );
};

export default SecurityPage;
