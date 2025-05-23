import { advertisingText, ratingText } from "@/helper/ratingText";
import { useRouter } from "next/navigation";

interface IProps {
  title: string;
  price: number;
  image: string; // Cập nhật kiểu dữ liệu của images
  city: string;
  quantityReview: number;
  rating: string;
  slug: string;
  advertising?: number;
}

const RoomItemRecomend: React.FC<IProps> = ({
  title,
  price,
  image,
  city,
  quantityReview,
  rating,
  slug,
  advertising,
}) => {
  const router = useRouter(); // Khởi tạo useRouter

  const handleNavigate = () => {
    router.push(`/detail/${slug}`); // Điều hướng đến trang chi tiết với ID
  };

  return (
    <div className="mt-2 z-0">
      <div
        onClick={() => handleNavigate()}
        className="border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
      >
        <img
          className="h-[250px] object-fit rounded-t-xl w-full"
          src={image}
          alt="anh"
        />
        <div className="p-2 h-[170px]">
          <h4 className="text-[16px] font-semibold min-h-[48px]">{title}</h4>
          <div className="flex items-center justify-between mt-1 h-[30px]">
            <div className="flex items-center gap-2">
              <span className="bg-green-700 font-medium text-sm text-white px-1 rounded-md">
                {rating}
              </span>
              <p className="text-sm">
                {ratingText(Number(rating))}{" "}
                <span>({quantityReview} reviews)</span>
              </p>
            </div>

            {advertising !== 0 && (
              <div className="font-semibold text-sm text-blue-900 border rounded-md px-2 py-1 border-blue-900">
                {advertisingText(Number(advertising))}
              </div>
            )}
          </div>
          <p className="text-sm mt-1">{city}</p>
          <p className="text-md font-semibold mt-2 text-right">
            {" "}
            {price?.toLocaleString("it-IT", {
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
