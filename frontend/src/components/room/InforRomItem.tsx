import { useRouter } from "next/navigation";

import { ratingText } from "@/helper/ratingText";

interface IProps {
  title: string;
  price: number;
  image: string;
  city: string;
  quantityReview: number;
  rating: number;
  slug: string;
}

const InforRomItem: React.FC<IProps> = ({
  title,
  price,
  image,
  city,
  quantityReview,
  rating,
  slug,
}) => {
  const router = useRouter(); // Khởi tạo useRouter

  const handleNavigate = () => {
    router.push(`/detail/${slug}`); // Điều hướng đến trang chi tiết với ID
  };

  return (
    <div
      onClick={handleNavigate}
      className="border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
    >
      <img
        className="h-[250px] object-fit rounded-t-xl w-full"
        src={image}
        alt="ảnh"
      />

      <div className="p-2 h-[162px]">
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-green-700 font-medium text-sm text-white px-1 rounded-md px-2">
            {rating}
          </span>
          <p className="text-sm">
            {ratingText(Number(rating))} <span>({quantityReview} reviews)</span>
          </p>
        </div>
        <h4 className="text-[16px] min-h-[48px] font-semibold mt-1">
          {title.length > 50 ? title.slice(0, 50) + "..." : title}
        </h4>
        <p className="text-sm mt-1">{city}</p>
        <p className="text-md font-semibold mt-2">
          {price?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <p className="text-[12px]">Một đêm</p>
        {/* <p className="text-[12px]">$350 total</p> */}
      </div>
    </div>
  );
};

export default InforRomItem;
