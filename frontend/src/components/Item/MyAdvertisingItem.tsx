"use client";

import moment from "moment";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import { IoTicketOutline } from "react-icons/io5";
import apisProperty from "@/apis/property";
import AdvertisingItem from "@/components/Item/AdvertisingItem";
import { IAdvertising } from "@/app/types/advertising";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const iconData: { [key: string]: JSX.Element } = {
  IoTicketOutline: <IoTicketOutline size={50} />,
};

interface IProps {
  advertisings: IAdvertising[];
}

const MyAdvertisingItem: React.FC<IProps> = ({ advertisings }) => {
  const { user } = useAuth();
  const [propertyId, setPropertyId] = useState<string>("");
  const searchParams = useSearchParams(); // Lấy query từ URL
  const router = useRouter();

  const [advertising, setAdvertising] = useState<
    | {
        expiredAd: string;
        advertisingDetail: {
          icon: string;
          name: string;
          price: number;
          description: string;
          id: string;
          type: number;
        };
      }
    | undefined
  >();

  useEffect(() => {
    const fetchPropertyId = async (id: string) => {
      const response = await apisProperty.getPropertyIdByUserId(id);

      if (response.data) {
        setPropertyId(response.data.id);
      }
    };
    if (user?.id) {
      fetchPropertyId(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchDataProperty = async () => {
      const response =
        await apisProperty.getAdvertisingByPropertyId(propertyId);

      if (
        response.data.advertising &&
        moment(response.data.expiredAd) > moment()
      ) {
        setAdvertising(response.data);
      }
    };
    fetchDataProperty();
  }, [propertyId]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "true") {
      toast.success("Thanh toán thành công");
      router.push("/homestay/advertising");
    } else if (status === "false") {
      toast.error("Thanh toán thất bại");
      router.push("/homestay/advertising");
    }
  }, [searchParams]);

  return (
    <div>
      {advertising && (
        <div>
          <h1 className="text-2xl font-semibold">Thông tin các đã đăng ký</h1>
          <div className="mt-4 w-[400px] border border-gray-300 p-4 rounded-md">
            <div className="flex w-full items-center gap-3">
              {advertising?.advertisingDetail?.icon &&
                iconData[advertising?.advertisingDetail?.icon]}
              <div className="w-full">
                <p className="font-semibold">
                  {advertising?.advertisingDetail?.name}
                </p>
                <div className="flex font-semibold items-center justify-between">
                  <p className="text-red-600 text-sm font-semibold">
                    {advertising?.advertisingDetail?.price?.toLocaleString(
                      "it-IT",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
              <li>{advertising?.advertisingDetail?.description}</li>
              <li>
                Thời hạn đến:{" "}
                {moment(advertising?.expiredAd).format("HH:mm DD/MM/YYYY")}
              </li>
            </ul>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold mt-8">
        Thông tin các gói quảng cáo
      </h1>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {advertisings.map((item: IAdvertising) => (
          <AdvertisingItem
            key={item.id}
            id={item.id}
            name={item.name}
            icon={item.icon}
            term={item.term}
            price={item.price}
            type={item.type}
            description={item.description}
            advertising={{
              type: advertising?.advertisingDetail?.type,
              id: advertising?.advertisingDetail?.id,
            }}
            propertyId={propertyId}
          />
        ))}
      </div>
    </div>
  );
};

export default MyAdvertisingItem;
