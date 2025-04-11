import { IoLocationSharp } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";

import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { MdPets } from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";
import ContainerRecomend from "@/components/container/ContainerRecomend";
import { FaPerson } from "react-icons/fa6";
import InforBookingContainer from "@/components/container/InforBookingContainer";
import ReviewContainer from "@/components/container/ReviewContainer";
import apisRoom from "@/apis/room";
import apisReview from "@/apis/review";
import { ratingText } from "@/helper/ratingText";
import AnmenityContainer from "@/components/container/AmenityContainer";

interface IProps {
  params: { slug: string };
}

interface IImage {
  image: string;
  id: string;
}

const DetailPage = async (props: IProps) => {
  const { params } = props;

  const room = await apisRoom.getRoomBySlug(params.slug);
  const rating = await apisReview.getReviewByRoom(room.data.id);
  const rooms = await apisRoom.getListTop10Rating();

  return (
    <div className="pt-4 w-[1260px] mx-auto">
      <div className="grid grid-cols-2 gap-1">
        <img
          className="w-full rounded-md"
          src={room.data.images[0].image}
          alt="anh"
        />

        <div className="grid grid-cols-2 gap-1">
          {room.data.images.map(
            (item: IImage, index: number) =>
              index > 0 && (
                <img
                  key={index}
                  className="w-full rounded-md"
                  src={item.image}
                  alt=""
                />
              )
          )}
        </div>
      </div>

      <div className="flex p-4 gap-5">
        <div className="mt-2 flex-7">
          <h2 className="font-semibold text-2xl">{room.data.name}</h2>

          <div className="flex items-center gap-1 mt-1">
            <IoLocationSharp size={22} className="text-blue-600" />
            <p className="text-sm">{room.data.address}</p>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-md text-sm font-medium text-white bg-green-800">
                {rating.data.averageRating || 0}
              </div>
              <span className="font-semibold text-xl">
                {ratingText(rating.data.averageRating)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-blue-600 text-sm cursor-pointer">
              <span>Xem tất cả đánh giá</span>
              <FaChevronRight />
            </div>
          </div>

          <p className="mt-4 text-sm">{room.data.description}</p>

          <div>
            <h5 className="mt-4 font-semibold text-lg">
              Các tiện nghi được ưa chuộng nhất
            </h5>
            <AnmenityContainer amenities={room.data.amenities} />
          </div>

          <div className="mt-8">
            <h4 className="font-semibold text-xl">Thông tin chung</h4>

            <div className="border-[1px] border-gray-300 rounded-md p-8 mt-4">
              <div className="flex pb-4">
                <div className="flex items-center gap-2 flex-3">
                  <CiLogin size={25} />
                  <p className="font-semibold">Nhận phòng</p>
                </div>

                <div className="flex-7">
                  <p className="text-sm">Từ 14:00</p>
                  <p className="text-sm">
                    Khách được yêu cầu xuất trình giấy tờ tùy thân có ảnh và thẻ
                    tín dụng lúc nhận phòng
                  </p>
                </div>
              </div>

              <div className="flex border-t border-gray-300 pt-10 mt-4 pb-4">
                <div className="flex items-center gap-2 flex-3">
                  <CiLogout size={25} />
                  <p className="font-semibold">Trả phòng</p>
                </div>

                <div className="flex-7">
                  <p className="text-sm">Đến 12:00</p>
                </div>
              </div>

              <div className="flex border-t border-gray-300 pt-10 mt-4 pb-4">
                <div className="flex items-center gap-2 flex-3">
                  <FaPerson size={25} />
                  <p className="font-semibold">Độ tuổi</p>
                </div>

                <div className="flex-7">
                  <p className="text-sm">
                    Không có yêu cầu về độ tuổi khi nhận phòng
                  </p>
                </div>
              </div>

              <div className="flex border-t border-gray-300 pt-10 mt-4">
                <div className="flex items-center gap-2 flex-3">
                  <MdPets size={25} />
                  <p className="font-semibold">Vật nuôi</p>
                </div>

                <div className="flex-7">
                  <p className="text-sm">Vật nuôi không được phép</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-3">
          <InforBookingContainer
            roomId={room.data.id}
            price={room.data.price}
          />
        </div>
      </div>

      <div className="mt-4 p-4">
        <h4 className="font-semibold text-xl">Đánh giá</h4>

        <div>
          <div className="mt-4">
            <p className="text-4xl text-green-700 font-semibold">
              {rating.data.averageRating || 0}/10
            </p>
            <p className="font-semibold">
              {ratingText(rating.data.averageRating)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-600">
              <p>{rating.data.reviewCount} Reviews</p>
              <RiErrorWarningLine />
            </div>
          </div>

          <div className="mt-4">
            <ReviewContainer />
          </div>

          <div className="flex justify-center mt-4">
            <button className="border-[1px] border-gray-400 rounded-3xl py-2 px-5 text-blue-600 font-semibold">
              See more reviews
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ContainerRecomend rooms={rooms.data} />
      </div>
    </div>
  );
};

export default DetailPage;
