import { ratingText } from "@/helper/ratingText";
import { useRouter } from "next/navigation";

interface IProps {
  title: string;
  price: number;
  images: { id: string; image: string }[]; // Cập nhật kiểu dữ liệu của images
  location: string;
  quantityReview: number;
  rating: number;
  slug: string;
}

const RoomItemRecomend: React.FC<IProps> = ({
  title,
  price,
  images,
  location,
  quantityReview,
  rating,
  slug,
}) => {
  const router = useRouter(); // Khởi tạo useRouter

  const handleNavigate = () => {
    router.push(`/detail/${slug}`); // Điều hướng đến trang chi tiết với ID
  };

  return (
    <div className="mt-2">
      <div className="border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
        <img
          className="min-h-[250px] object-fit rounded-t-xl"
          src={images[0]?.image}
          alt="anh"
        />
        <div onClick={() => handleNavigate()} className="p-2">
          <h4 className="text-[16px] font-semibold min-h-[48px]">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-green-700 font-medium text-sm text-white px-1 rounded-md">
              {rating}
            </span>
            <p className="text-sm">
              {ratingText(Number(rating))}{" "}
              <span>({quantityReview} reviews)</span>
            </p>
          </div>
          <p className="text-sm mt-1">{location}</p>
          <p className="text-md font-semibold mt-2 text-right">
            {" "}
            {price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <p className="text-[12px] text-right">mỗi đêm</p>
          {/* <p className="text-[12px] text-right">$350 total</p> */}
        </div>
      </div>
    </div>
  );
};

export default RoomItemRecomend;
