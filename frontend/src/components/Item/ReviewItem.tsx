import { ratingText } from "@/helper/ratingText";
import moment from "moment";

interface IProps {
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  rating: number;
  text: string;
  createdAt: string;
}

const ReviewItem: React.FC<IProps> = ({ user, rating, text, createdAt }) => {
  return (
    <div className="border-b border-gray-300 pb-3 mt-3">
      <h4 className="text-lg font-semibold">{`${rating}/5 ${ratingText(rating)}`}</h4>
      <p className="font-semibold">{`${user?.firstName} ${user?.lastName}`}</p>
      <p className="text-sm">{moment(createdAt).format("HH:mm DD/MM/YYYY")}</p>
      <p className="text-sm mt-1">{text}</p>
    </div>
  );
};

export default ReviewItem;
