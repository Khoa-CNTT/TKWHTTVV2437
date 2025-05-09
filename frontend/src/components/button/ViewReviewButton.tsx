"use client";

import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import ReviewModal from "../modal/ReviewModal";

interface IProps {
  propertyId: string;
  avgRating: string;
  reviewCount: number;
  image: string;
  name: string;
  advertising: number;
  city: string;
  price: string;
  slug: string;
}

interface IData {
  propertyId: string;
  avgRating: string;
  reviewCount: number;
  image: string;
  name: string;
  advertising: number;
  city: string;
  price: string;
  slug: string;
}

const ViewReviewButton: React.FC<IProps> = ({
  propertyId,
  avgRating,
  reviewCount,
  image,
  name,
  advertising,
  city,
  price,
  slug,
}) => {
  const [showModalReview, setShowModalReview] = useState<boolean>(false);

  useEffect(() => {
    let data: IData[] = [];

    const storedData = localStorage.getItem("dataRecommend");
    if (storedData) {
      data = JSON.parse(storedData);
    }

    if (data.length >= 10) {
      data.pop();
    }

    data = data.filter((item: IData) => item.propertyId !== propertyId);

    data.unshift({
      propertyId,
      avgRating,
      reviewCount,
      image,
      name,
      advertising,
      city,
      price,
      slug,
    });

    localStorage.setItem("dataRecommend", JSON.stringify(Array.from(data)));
  }, []);

  return (
    <div className="relative">
      <div
        onClick={() => {
          if (Number(avgRating) === 0) return;
          setShowModalReview(true);
        }}
        className="cusor-pointer flex items-center gap-2 mt-2 text-blue-600 text-sm cursor-pointer"
      >
        <span className="">Xem tất cả đánh giá</span>
        <FaChevronRight />
      </div>

      {showModalReview && (
        <ReviewModal
          onShowModalReview={setShowModalReview}
          propertyId={propertyId}
          avgRating={avgRating}
          reviewCount={reviewCount}
        />
      )}
    </div>
  );
};

export default ViewReviewButton;
