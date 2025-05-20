"use client";

import { IImage } from "@/app/types/property";
import apisProperty from "@/apis/property";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import clsx from "clsx";

interface IProps {
  propertyId: string;
  onShowModal: (value: boolean) => void;
}

const MoreImageModal: React.FC<IProps> = ({ propertyId, onShowModal }) => {
  const [images, setImages] = useState<IImage[]>([]);

  useEffect(() => {
    const fetchDataImage = async () => {
      const response = await apisProperty.getImageByPropertyId(propertyId);

      if (response?.status === "OK") {
        setImages(response?.data?.images);
      }
    };
    fetchDataImage();
  }, [propertyId]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed w-creeen h-screen z-10 inset-0 flex items-center justify-center bg-overblack"
    >
      <div
        className={clsx(
          "bg-white w-[1200px] rounded-md shadow-lg py-6 flex flex-col",
          images.length >= 6 ? "pl-6" : "px-6"
        )}
      >
        <div className="flex items-center gap-4">
          <IoMdClose
            onClick={() => onShowModal(false)}
            className="text-blue-800 hover:bg-blue-200 rounded-full cursor-pointer"
            size={27}
          />
          <p className="font-semibold text-lg">Tất cả các ảnh</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 overflow-y-auto max-h-[80vh] pb-[20px]">
          {images.map((image, index) => (
            <div key={index}>
              <img
                className="rounded-sm w-full h-[230px] object-cover"
                src={image?.image}
                alt={image.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreImageModal;
