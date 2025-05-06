"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditDetailPage = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const pathname = usePathname();

  const isOpen = searchParam.get("edit") === "info";
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);
  if (!show) return null;

  return <div>okd123</div>;
};

export default EditDetailPage;
