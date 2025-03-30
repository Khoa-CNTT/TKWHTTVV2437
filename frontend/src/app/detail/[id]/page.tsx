"use client";

import { IoLocationSharp } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import { FaSwimmer } from "react-icons/fa";
import { TbSmokingNo } from "react-icons/tb";
import { FaWifi } from "react-icons/fa";
import { LuCircleParking } from "react-icons/lu";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { MdPets } from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";

import { FaPerson } from "react-icons/fa6";

import InforBookingContainer from "@/components/container/InforBookingContainer";
import ReviewContainer from "@/components/container/ReviewContainer";

const data = [
  {
    icon: <FaSwimmer />,
    title: "Hồ bơi",
  },
  {
    icon: <TbSmokingNo />,
    title: "Không hút thuốc",
  },
  {
    icon: <FaWifi />,
    title: "Wifi miễn phí",
  },
  {
    icon: <LuCircleParking />,
    title: "Chỗ đậu xe miễn phí",
  },
];

const DetailPage = () => {
  return (
    <div className="pt-4 w-[1260px] mx-auto">
      <div className="grid grid-cols-2 gap-1">
        <img
          className="w-full rounded-md"
          src="https://media.vrbo.com/lodging/35000000/34590000/34580200/34580125/454b6094.jpg?impolicy=resizecrop&rw=598&ra=fit"
          alt=""
        />

        <div className="grid grid-cols-2 gap-1">
          <img
            className="w-full rounded-md"
            src="https://media.vrbo.com/lodging/35000000/34590000/34580200/34580125/454b6094.jpg?impolicy=resizecrop&rw=598&ra=fit"
            alt=""
          />
          <img
            className="w-full rounded-md"
            src="https://media.vrbo.com/lodging/35000000/34590000/34580200/34580125/454b6094.jpg?impolicy=resizecrop&rw=598&ra=fit"
            alt=""
          />
          <img
            className="w-full rounded-md"
            src="https://media.vrbo.com/lodging/35000000/34590000/34580200/34580125/454b6094.jpg?impolicy=resizecrop&rw=598&ra=fit"
            alt=""
          />
          <img
            className="w-full rounded-md"
            src="https://media.vrbo.com/lodging/35000000/34590000/34580200/34580125/454b6094.jpg?impolicy=resizecrop&rw=598&ra=fit"
            alt=""
          />
        </div>
      </div>

      <div className="flex p-4 gap-5">
        <div className="mt-2 flex-7">
          <h2 className="font-semibold text-2xl">Nostalgia Boutique Hotel</h2>

          <div className="flex items-center gap-1 mt-1">
            <IoLocationSharp size={22} className="text-blue-600" />
            <p className="text-sm">
              11A Ho Xuan Huong Street, Đà Nẵng, Việt Nam
            </p>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-md text-sm font-medium text-white bg-green-800">
                10
              </div>
              <span className="font-semibold text-xl">Exceptional</span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-blue-600 text-sm cursor-pointer">
              <span>See all reviews</span>
              <FaChevronRight />
            </div>
          </div>

          <p className="mt-4 text-sm">
            Giảm giá Genius tại chỗ nghỉ này tùy thuộc vào ngày đặt phòng, ngày
            lưu trú và các ưu đãi có sẵn khác. Nằm ở Đà Nẵng, cách Bãi biển Bắc
            Mỹ An chưa đến 1 km, Nostalgia Boutique Hotel cung cấp chỗ nghỉ có
            trung tâm thể dục, chỗ đậu xe riêng miễn phí, phòng chờ chung và sân
            hiên. Mỗi phòng tại khách sạn 4 sao này đều nhìn ra thành phố, đồng
            thời khách có thể sử dụng hồ bơi trong nhà. Chỗ nghỉ cung cấp lễ tân
            24/24, dịch vụ đưa đón sân bay, bếp chung và Wi-Fi miễn phí. Các căn
            tại khách sạn được trang bị điều hòa, khu vực ghế ngồi, TV màn hình
            phẳng có truyền hình vệ tinh, két an toàn, phòng tắm riêng, vòi
            xịt/chậu rửa vệ sinh, đồ vệ sinh cá nhân miễn phí và máy sấy tóc.
            Các phòng được thiết kế có ấm đun nước, trong đó một số phòng có ban
            công và một số khác thì nhìn ra núi. Tại Nostalgia Boutique Hotel,
            tất cả các phòng có ga trải giường và khăn tắm. Leo núi là hoạt động
            được ưa chuộng trong khu vực. Ngoài ra, chỗ nghỉ có dịch vụ thuê xe
            đạp và dịch vụ thuê ô tô. Nostalgia Boutique Hotel cách Bãi biển Mỹ
            Khê 14 phút đi bộ và Công viên giải trí Asia Park Đà Nẵng 2.3 km.
            Các cặp đôi đặc biệt thích địa điểm này — họ cho điểm 8,6 khi đánh
            giá chuyến đi hai người.
          </p>

          <div>
            <h5 className="mt-4 font-semibold text-lg">
              Các tiện nghi được ưa chuộng nhất
            </h5>
            <div className="grid grid-cols-5 gap-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mt-2 text-sm font-medium"
                >
                  <div className="text-green-700 text-xl">{item.icon}</div>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
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
          <InforBookingContainer />
        </div>
      </div>

      <div className="mt-4 p-4">
        <h4 className="font-semibold text-xl">Đánh giá</h4>

        <div>
          <div className="mt-4">
            <p className="text-4xl text-green-700 font-semibold">9.8/10</p>
            <p className="font-semibold">Exceptional</p>
            <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-600">
              <p>9 Reviews</p>
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
    </div>
  );
};

export default DetailPage;
