"use client";

import moment from "moment";
import { ratingText } from "@/helper/ratingText";

interface IProps {
  id: string;
  text: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

const ReviewItem: React.FC<IProps> = ({
  id,
  text,
  rating,
  createdAt,
  user,
}) => {
  return (
    <div className="border-gray-500 rounded-xl p-2 shadow-md">
      <h2 className="font-medium">{`${rating}/5 ${ratingText(rating)}`}</h2>
      <p className="mt-4 text-sm h-[90px]">
        {text.length <= 150 ? text : text.slice(0, 200) + "..."}
      </p>

      {/* <p className="text-sm text-blue-600 mt-4 mb-4">See more</p> */}

      <div className="mt-4">
        <p className="font-semibold text-sm">{`${user?.firstName} ${user?.lastName}`}</p>
        <p className="text-sm">
          {moment(createdAt).format("HH:mm DD/MM/YYYY")}
        </p>
      </div>
    </div>
  );
};

export default ReviewItem;
