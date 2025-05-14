"use client";

import { useState } from "react";
import { IImage } from "@/app/types/property";
import { FaImage } from "react-icons/fa";
import MoreImageModal from "../modal/MoreImageModal";

interface IProps {
  images: IImage[];
  propertyId: string;
}

const ImageContainer: React.FC<IProps> = ({ images, propertyId }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative grid grid-cols-2 gap-1">
      {images?.slice(1, 5)?.map((item: IImage, index: number) => (
        <div className="w-full h-[207px] rounded-md overflow-hidden">
          <img
            key={index}
            className="object-cover w-full h-full"
            src={item.image}
            alt=""
          />
        </div>
      ))}

      <div
        onClick={() => setShowMore(true)}
        className="absolute right-[10px] bottom-[10px] cursor-pointer flex gap-2 items-center border border-gray-300 rounded-md p-2"
      >
        <FaImage size={20} className="text-white" />
        <p className="text-white text-sm font-semibold">Xem thêm</p>
      </div>

      {showMore && (
        <div className="absolute">
          <MoreImageModal onShowModal={setShowMore} propertyId={propertyId} />
        </div>
      )}
    </div>
  );
};

export default ImageContainer;
