import apiRegisterPartner from "@/api/registerPartner";
import dayjs from "dayjs";
import Swal from "sweetalert2";
interface IBooking {
  id: string;
  idUser: string;
  idRoom: string;
  checkIndate: string; // ISO string
  checkOutdate: string; // ISO string
  numGuest: number | null;
  totalPrice: number;
  status: string;
  message: string;
  nameAccount: string;
  numberAccount: string;
  nameBank: string;
  statusUser: string;
  returnImgBanking: string | null;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageBanking: string;
  reason: string | null;
  idProperty: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  rooms: {
    id: string;
    name: string;
  };
  users: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  properties: {
    id: string;
    name: string;
    users: {
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
    };
  };
}
interface IProps {
  handleCloseAppove?: () => void;
  data: IBooking;
}

const ItemReservationAdmin = ({ handleCloseAppove, data }: IProps) => {
  console.log("data ", data);
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex justify-end items-center z-50 h-screen"
      onClick={() => {
        handleCloseAppove?.();
      }}
    >
      <div
        className="w-[750px] min-w-[750px] bg-white h-full p-8 max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-8">
          <h3 className="text-[20px] font-semibold ">Chi tiết</h3>
          <h3 className={` font-semibold text-[-20]  text-primary`}>
            {data?.statusUser === "created"
              ? `Khách đặt và ${
                  data?.status === "waiting"
                    ? "đang chờ phê duyệt"
                    : data?.status === "reject"
                      ? "đã từ chối"
                      : "đã phê duyệt"
                }`
              : `Khách hủy và ${
                  data?.status === "refund" ? "đã hoàn tiền" : "đang chờ xử lí"
                }`}
          </h3>
        </div>
        <div className="mt-4 flex flex-col gap-4 p-4 border border-gray-500 rounded-2xl ">
          <h3 className="text-[-18] font-semibold">
            Thông tin tài khoản khách hàng đặt trong hệ thống
          </h3>

          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Email</p>
            <input
              type="text"
              placeholder="Email"
              value={data?.users?.email}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">
              Điện thoại di động
            </p>
            <input
              type="text"
              placeholder="Phone"
              value={data?.users?.phone}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4 p-4 border border-gray-500 rounded-2xl">
          <h3 className="text-[-18] font-semibold">Thông tin đơn đặt</h3>
          <div className="flex gap-4">
            {/* Họ */}
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Họ</p>
              <input
                type="text"
                value={data?.lastName}
                placeholder="Họ"
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tên */}
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Tên</p>
              <input
                type="text"
                placeholder="Tên"
                value={data?.firstName}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {/* Họ */}
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Email</p>
              <input
                type="text"
                value={data?.email}
                placeholder="Email"
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tên */}
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Điện thoại di động</p>
              <input
                type="text"
                placeholder="Phone"
                value={data?.phone}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {/* Họ */}
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Check-in</p>
              <input
                type="text"
                value={dayjs(data?.checkIndate)?.format("DD/MM/YYYY HH:mm")}
                placeholder="Check-in"
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tên */}
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Check-out</p>
              <input
                type="text"
                placeholder="Check-out"
                value={dayjs(data?.checkOutdate)?.format("DD/MM/YYYY HH:mm")}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Mã xác nhận</p>
              <input
                type="text"
                value={data?.code}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Tổng</p>
              <input
                type="text"
                value={data?.totalPrice?.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Tên tài khoản</p>
              <input
                type="text"
                value={data?.nameAccount}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Số tài khoản</p>
              <input
                type="text"
                value={data?.numberAccount}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Ngân hàng</p>
            <input
              type="text"
              value={data?.nameBank}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Tin nhắn</p>
            <input
              type="text"
              value={data?.message}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">Chứng từ thanh toán</p>
            <img
              src={data?.imageBanking || ""}
              alt="Ảnh 1"
              className="w-[200px] h-[150px] object-contain object-center rounded-md border"
            />
          </div>

          <h3 className="font-semibold">Xử lí của chủ sở hữu</h3>

          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Lí do từ chối</p>
            <input
              type="text"
              value={data?.reason || "Không có"}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            {/* Ảnh 2 */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Chứng từ hoàn tiền</p>
              {data?.returnImgBanking ? (
                <img
                  src={"data?.afterImage"}
                  alt="Ảnh 2"
                  className="w-[200px] h-[150px] object-contain object-center rounded-md border"
                />
              ) : (
                <p className=" text-[-14] ">Không có</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 p-4 border border-gray-500 rounded-2xl ">
          <h3 className="text-[-18] font-semibold">
            Thông tin homestay/resort
          </h3>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Tên</p>
            <input
              type="text"
              value={data?.properties?.name}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Email</p>
            <input
              type="text"
              placeholder="Email"
              value={data?.users?.email}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">
              Điện thoại di động
            </p>
            <input
              type="text"
              placeholder="Phone"
              value={data?.users?.phone}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end my-4">
          <button
            className="py-2 px-8 bg-gray-200 text-black w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
            onClick={() => {
              handleCloseAppove?.();
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemReservationAdmin;
