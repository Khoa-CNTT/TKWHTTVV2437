import { SlCalender } from "react-icons/sl";
import { FaList, FaUserEdit } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import apisRoom from "@/apis/room";
import apiReservation from "@/api/reservation";
import apisProperty from "@/apis/property";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";

interface IProps {
  params: { slug: string };
}
interface Amenity {
  icon: string; // Tên icon (key trong `iconMap`)
  name: string; // Tên tiện ích
}

const DetailPage = async (props: IProps) => {
  dayjs.locale("vi");
  const { params } = props;
  console.log(params);

  const reservation = await apiReservation.detailReservationApprove(
    params.slug
  );
  const room = await apisRoom.getDetailById(reservation.data.idRoom);
  // console.log(reservation);
  const property = await apisProperty.getPropertyById(room.data.idProperty);
  console.log("reservation", reservation);
  console.log("room", room);
  console.log("property", property);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nội dung bên trái */}

        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Thông báo xác nhận */}
          <div>
            <p className="text-green-600 font-semibold mb-2">Đã xác nhận</p>
            <h1 className="text-2xl font-bold mb-4">
              Đặt phòng của bạn ở {property?.data.propertyAddress.city} đã được
              xác nhận.
            </h1>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>
                Mọi thứ xong xuôi! Chúng tôi đã gửi email xác nhận đến{" "}
                <b>{reservation?.data?.email}</b>
              </li>
              <li>
                Thanh toán của bạn sẽ được xử lý bởi{" "}
                <b>{property?.data?.name}</b>.
              </li>
              <li>
                Giờ đây, bạn có thể chỉnh sửa hoặc huỷ đặt phòng cho đến khi
                dịch vụ xác nhận
              </li>
            </ul>
          </div>

          {/* Thông tin khách sạn */}
          <div className="border rounded-lg shadow p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2 w-2/3">
                  <h2 className="text-2xl font-bold max-w-full">
                    {property?.data?.name}
                  </h2>
                  {/* <p className="text-gray-500 mt-1 text-sm">★★★</p> */}
                </div>
                <div className="flex gap-3 items-start">
                  <span>
                    <SlCalender className="w-6 h-6" />
                  </span>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="pr-14 border-r border-gray-400 flex flex-col gap-1">
                      <p className="font-semibold">Nhận phòng</p>
                      <p className="font-bold text-[-18]">
                        {dayjs(reservation?.data?.checkInDate).format(
                          "dddd, D [tháng] M, YYYY"
                        )}
                      </p>
                      <p>14:00 - 23:00</p>
                    </div>
                    <div className="pl-5 flex flex-col gap-1">
                      <p className="font-semibold">Trả phòng</p>
                      <p className="font-bold text-[-18]">
                        {dayjs(reservation?.data?.checkOutDate).format(
                          "dddd, D [tháng] M, YYYY"
                        )}
                      </p>
                      <p>00:00 - 12:00</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span>
                    <FaList className="w-6 h-6" />
                  </span>
                  <div className="text-sm flex flex-col gap-1">
                    <p className="font-semibold">Chi tiết đặt phòng</p>
                    <p>
                      {dayjs(reservation.data.checkIndate) &&
                        dayjs(reservation.data.checkOutdate) &&
                        Math.abs(
                          dayjs(reservation.data.checkIndate)?.diff(
                            dayjs(reservation.data.checkOutdate),
                            "day"
                          )
                        )}{" "}
                      đêm - 1 phòng cho {room?.data.maxPerson} người lớn
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span>
                    <LuMapPin className="w-6 h-6" />
                  </span>
                  <div className="text-sm flex flex-col gap-1">
                    <p className="font-semibold">Địa chỉ</p>
                    <p>{property?.data?.address}</p>
                  </div>
                </div>

                <div>
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Chi tiết phòng</h2>

                    {/* Thông tin phòng */}
                    <div className="flex items-start gap-4 mb-8">
                      <img
                        src="https://vcdn1-dulich.vnecdn.net/2022/06/01/Hoi-An-VnExpress-5851-16488048-4863-2250-1654057244.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2ea_f0O7kgGZllKmJF92g"
                        alt="Phòng Có Giường Cỡ King"
                        className="w-32 h-24 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">
                          {reservation?.data.rooms.name}
                        </p>
                      </div>
                    </div>

                    <div className=" mx-auto p-6 text-sm space-y-6">
                      <div className="flex">
                        <div className="w-48 font-semibold">Tên khách</div>
                        <div className="flex gap-2">
                          <p>
                            {reservation?.data.lastName}{" "}
                            {reservation?.data.firstName}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="w-48 font-semibold">
                          Sức chứa tối đa
                        </div>
                        <div>{room?.data.maxPerson} người lớn</div>
                      </div>

                      <div className="flex">
                        <div className="w-48 font-semibold">Tiện nghi</div>
                        <div className="flex flex-col">
                          {room?.data?.amenities.map(
                            (item: Amenity, index: string) => {
                              return (
                                <div key={index} className="flex-1">
                                  {item?.name}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div className="flex">
                        <div className="w-48 font-semibold">Dịch vụ</div>
                        <div className="flex flex-col">
                          {room?.data?.summaries.map(
                            (item: Amenity, index: string) => {
                              return (
                                <div key={index} className="flex-1">
                                  {item?.name}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex">
                          <div className="w-48 font-semibold">
                            Phí huỷ phòng
                          </div>
                          <div className="space-y-1">
                            <p className="text-green-600 font-semibold">
                              Miễn phí huỷ
                            </p>
                            <p>Trước khi dịch vụ xác nhận đặt phòng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img
                src="https://vcdn1-dulich.vnecdn.net/2022/06/01/Hoi-An-VnExpress-5851-16488048-4863-2250-1654057244.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Z2ea_f0O7kgGZllKmJF92g"
                alt="Hotel room"
                className="w-32 h-24 rounded object-cover"
              />
            </div>
          </div>

          <div>
            <div className="w-full  p-6 border border-gray-200 rounded-md  ">
              <div className="flex justify-between items-start">
                <div>1 phòng</div>
                <p>
                  {Number(room?.data.price).toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="flex justify-between items-start">
                <div>Đêm</div>
                <p>
                  x{" "}
                  {dayjs(reservation.data.checkIndate) &&
                    dayjs(reservation.data.checkOutdate) &&
                    Math.abs(
                      dayjs(reservation.data.checkIndate)?.diff(
                        dayjs(reservation.data.checkOutdate),
                        "day"
                      )
                    )}{" "}
                  đêm
                </p>
              </div>
            </div>
            <div className="w-full flex justify-between items-start p-6 border border-blue-200 rounded-md text-xl text-primary">
              <div>Tổng thanh toán</div>
              <p>
                {Number(
                  Number(room?.data.price) *
                    Number(
                      Math.abs(
                        dayjs(reservation.data.checkIndate)?.diff(
                          dayjs(reservation.data.checkOutdate),
                          "day"
                        )
                      )
                    )
                ).toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
            <div className="my-4">
              <h1 className="font-semibold">Chứng từ thanh toán của bạn</h1>
              <div className="mt-2 flex justify-center bg-blue-50 border border-blue-800">
                <img
                  src="https://einvoice.vn/FileUpload/ArticleMaterials/images/mau-hoa-don-3(2).png"
                  alt=""
                  className="h-72 object-contain"
                />
              </div>
            </div>

            <div className="my-10 border-y border-t-gray-200 border-b-gray-200 py-6 flex flex-col gap-4">
              <h1 className="text-xl font-semibold">Liên hệ chỗ nghĩ</h1>
              <p className="text-[-14] ">
                Đối với hầu hết các câu hỏi, chỗ nghỉ là nơi tốt nhất để liên hệ
              </p>

              <div className="flex items-start gap-2">
                <span className="text-[30px]">
                  <MdOutlineEmail />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">Gởi email cho chỗ nghĩ</h3>
                  <p className="text-[-14]">
                    Hãy email cho chỗ nghĩ và họ sẽ trả lời sớm nhất có thể
                  </p>
                  <a
                    href="mailto:badagor999@gmail.com"
                    className="font-semibold text-primary hover:opacity-70 cursor-pointer"
                  >
                    Gởi email
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[30px]">
                  <IoCallOutline />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">Gọi điện cho chỗ nghỉ</h3>

                  <a
                    href="tel:0707560285"
                    className="font-semibold text-primary hover:opacity-70 cursor-pointer"
                  >
                    0123456789
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ">
              <h1 className="text-2xl">Chúc bạn có một chuyến đi vui vẻ</h1>
              <p className="">Đội ngũ nhân viên HRtravel</p>
            </div>
          </div>
        </div>

        {/* Sidebar bên phải */}
        <div className="flex flex-col gap-6">
          {/* Mã xác nhận */}
          <div className="border border-red-500 rounded-lg shadow p-6 flex flex-col gap-4 bg-yellow-50">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Mã xác nhận:</p>
              <p className="text-lg font-bold">{reservation?.data?.code}</p>
            </div>
          </div>

          {/* Các hành động */}
          <div className="border rounded-lg shadow p-6 flex flex-col gap-4">
            <p className="font-semibold">Tất cả các thông tin có đúng không?</p>
            <div className="flex items-center text-primary font-semibold underline gap-1 cursor-pointer hover:opacity-70 w-fit">
              <span className="w-4 h-4">
                <IoMdCloseCircle />
              </span>
              <span>Huỷ đặt phòng ?</span>
            </div>
            <div className="flex items-center text-primary font-semibold underline gap-1 cursor-pointer hover:opacity-70 w-fit">
              <span className="w-4 h-4">
                <FaUserEdit />
              </span>
              <span>Chỉnh sửa thông tin của bạn?</span>
            </div>
          </div>

          {/* Liên hệ chỗ nghỉ */}
          <div className="border rounded-lg shadow p-6 flex flex-col gap-4 text-sm">
            <p className="font-semibold">Liên hệ chỗ nghỉ</p>
            <p>Điện thoại: +84 961 932 532</p>
            <a
              href="mailto:badagor999@gmail.com"
              className="text-blue-600 underline text-left hover:text-blue-800"
            >
              Nhắn tin
            </a>
            <a
              href="tel:0707560285"
              className="text-blue-600 underline text-left hover:text-blue-800"
            >
              Gửi email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailPage;
