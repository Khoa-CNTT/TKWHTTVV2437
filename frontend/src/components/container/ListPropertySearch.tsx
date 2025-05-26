"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import apisProperty from "@/apis/property";
import { IProperty } from "@/app/types/property";
import InforRomItem from "../room/InforRomItem";
import moment from "moment";
import SearchNotResult from "../Item/SearchNotResult";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import LoadingItem from "../loading/LoadingItem";

interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const ListPropertySearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Lấy query từ URL
  const queryObject = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );
  const [property, setProperty] = useState<IProperty[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Gọi API với queryObject
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await apisProperty.getListProperty(queryObject);
      if (response?.data) {
        setProperty(response?.data);
        setPagination(response?.pagination);
      }
      setLoading(false);
    };

    fetchData();
  }, [queryObject]);

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center mt-4">
          <LoadingItem />
        </div>
      )}
      {property.length === 0 && !loading ? (
        <SearchNotResult />
      ) : (
        <div>
          <div className="grid grid-cols-4 gap-4 gap-y-6 mt-6">
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
                  moment(item.expiredAd) > moment()
                    ? Number(item?.advertising)
                    : 0
                }
              />
            ))}
          </div>

          {pagination?.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Stack spacing={2}>
                <Pagination
                  page={Number(searchParams.get("page")) || 1}
                  onChange={(
                    event: React.ChangeEvent<unknown>,
                    page: number
                  ) => {
                    const query = new URLSearchParams(searchParams.toString());
                    query.set("page", page.toString());
                    router.push(`/search?${query.toString()}`);
                  }}
                  count={pagination?.totalPages}
                  variant="outlined"
                  shape="rounded"
                />
              </Stack>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListPropertySearch;
