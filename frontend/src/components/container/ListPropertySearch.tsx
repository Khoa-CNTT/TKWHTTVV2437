"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import apisProperty from "@/apis/property";
import { IProperty } from "@/app/types/property";
import InforRomItem from "../room/InforRomItem";
import moment from "moment";

const ListPropertySearch = () => {
  const searchParams = useSearchParams(); // Lấy query từ URL
  const queryObject = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );
  const [property, setProperty] = useState<IProperty[]>([]);

  // Gọi API với queryObject
  useEffect(() => {
    const fetchData = async () => {
      const response = await apisProperty.getListProperty(queryObject);
      if (response?.data) {
        setProperty(response?.data);
      }
    };

    fetchData();
  }, [queryObject]);

  return (
    <div className="grid grid-cols-4 gap-2 mt-6">
      {property.map((item) => (
        <InforRomItem
          image={item.images[0]?.image}
          key={item.id}
          title={item.name}
          price={item.price}
          city={item?.propertyAddress?.city}
          quantityReview={item.reviewCount}
          rating={item.averageRating || 0}
          slug={item.slug}
          advertising={
            moment(item.expiredAd) > moment() ? Number(item?.advertising) : 0
          }
        />
      ))}
    </div>
  );
};

export default ListPropertySearch;
