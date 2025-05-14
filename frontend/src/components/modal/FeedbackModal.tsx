import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "@/app/contexts/AuthContext";
import apisReview from "@/apis/review";

interface IProps {
  onCloseModal: (value: boolean) => void;
  reviewId: string;
  star: number;
  text: string;
  propertyId: string;
}

const starVote = [
  {
    id: 1,
    title: "Rất tệ",
  },
  {
    id: 2,
    title: "Tệ",
  },
  {
    id: 3,
    title: "Bình thường",
  },
  {
    id: 4,
    title: "Tốt",
  },
  {
    id: 5,
    title: "Tuyệt vời",
  },
];

const FeedbackModal = ({
  onCloseModal,
  reviewId,
  star,
  text,
  propertyId,
}: IProps) => {
  const [valueStar, setValueStar] = useState(5);
  const [starHover, setStarHover] = useState(0);
  const [value, setValue] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    setValueStar(star);
    setValue(text);
  }, [star, text]);

  const handleSubmitForm = () => {
    if (value.length <= 10) {
      toast.error("Nhận xét của bạn quá ngắn!");
      return;
    }

    if (value.length > 500) {
      toast.error("Nhận xét của bạn quá dài!");
      return;
    }

    const postReview = async () => {
      const response = await apisReview.createReview({
        idUser: user?.id || "",
        idProperty: propertyId,
        rating: valueStar,
        text: value,
      });

      if (response.status === "OK") {
        toast.success("Đánh giá thành công!");
        onCloseModal(false);
      } else {
        toast.error("Đánh giá thất bại!");
      }
    };

    const updateReview = async () => {
      const response = await apisReview.updateReview({
        id: reviewId,
        rating: valueStar,
        text: value,
      });

      if (response.status === "OK") {
        toast.success("Cập nhật đánh giá thành công!");
        onCloseModal(false);
      } else {
        toast.error("Cập nhật đánh giá thất bại!");
      }
    };

    if (reviewId) {
      updateReview();
    } else {
      postReview();
    }
  };

  const onChange = () => {
    if (valueStar === star && value.trim() === text.trim()) {
      return false;
    }

    return true;
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed w-creeen h-screen z-10 inset-0 flex items-center justify-center bg-overblack"
    >
      <div className="bg-white w-[600px] rounded-md shadow-lg p-4 flex flex-col">
        <div className="flex items-center gap-4">
          <IoMdClose
            onClick={() => onCloseModal(false)}
            className="text-blue-800 hover:bg-blue-200 rounded-full cursor-pointer"
            size={27}
          />

          <p className="font-semibold text-lg">Đánh giá chuyến đi</p>
        </div>

        <div className="mt-6 border-b-[1px] px-10">
          <div className="flex mt-5 pb-3">
            {starVote.map((item) => (
              <div
                onClick={() => setValueStar(item.id)}
                onMouseEnter={() => setStarHover(item.id)}
                onMouseLeave={() => setStarHover(0)}
                key={item.id}
                className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
              >
                <FaStar
                  size={27}
                  color={`${starHover ? (item.id <= starHover ? "#FFBF00" : "#C6CCD3") : item.id <= valueStar ? "#FFBF00" : "#C6CCD3"}`}
                />
                <span className="text-[13px] text-[#4A4A4A]">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-[200px] p-2 w-full mt-8 border rounded-md outline-blue-500 text-black"
          rows={7}
          placeholder="Nhập cảm nhận của bạn về chuyến đi tuyệt vời!"
        />

        <button
          onClick={handleSubmitForm}
          disabled={!onChange()}
          className={`text-[16px] text-blue-700 font-bold bg-main w-full py-2 rounded-md mt-6 border border-blue-700 hover:bg-blue-200 ${
            !onChange() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {reviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
