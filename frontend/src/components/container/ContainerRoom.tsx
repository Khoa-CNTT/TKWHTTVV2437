"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import InforRomItem from "../room/InforRomItem";
import TitleContainer from "./TitleContainer";
import { IProperty } from "@/app/types/property";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import moment from "moment";

interface IProps {
  properties: [];
}

const ContainerRoom: React.FC<IProps> = ({ properties }) => {
  return (
    <div className="pt-4 mt-8">
      <TitleContainer
        title="Các Homestay nổi bật"
        description="Show deals for: May 2 - May 4"
      />

      <div className="mt-4">
        <Swiper
          spaceBetween={15}
          slidesPerView={4}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
        >
          {properties?.map((item: IProperty, index: number) => (
            <SwiperSlide key={index}>
              <InforRomItem
                image={item.images[0]?.image}
                key={index}
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContainerRoom;
