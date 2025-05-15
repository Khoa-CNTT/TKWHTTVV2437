import apiRegisterPartner from "@/api/registerPartner";
import Swal from "sweetalert2";

interface IDataRegisterPartner {
  id: string;
  name: string;
  numberCCCD: string;
  beforeImage: string;
  afterImage: string;
  status: string;
  idUser: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    password: string;
    phone: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    bio: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    emergencyPhone: string | null;
    address: string | null;
    role: string;
    status: string | null;
  };
}

interface IProps {
  handleCloseAppove?: () => void;
  data: IDataRegisterPartner;
  setAction: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemRegisterPartnerAdminPage = ({
  handleCloseAppove,
  data,
  setAction,
}: IProps) => {
  const handleAction = async (status: string) => {
    if (data) {
      if (status === "rejected") {
        const result = await Swal.fire({
          title: "Bạn có chắc muốn từ chối?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Thực hiện",
          cancelButtonText: "Hủy",
        });
        if (result.isConfirmed) {
          // Gọi API xóa ở đây
          try {
            const res = await apiRegisterPartner.updateRegisterPartnerByAdmin(
              data?.id,
              { status: status }
            ); // <-- gọi API thật sự

            if (res?.status === "OK") {
              Swal.fire({
                icon: "success",
                title: "Thành công!",
                text: "Đã từ chối người đồng hành!",
                confirmButtonText: "OK",
              });
              handleCloseAppove?.();
              setAction((prev) => !prev);
            }
          } catch (error) {
            Swal.fire("Lỗi!", "Xóa không thành công.", "error");
          }
        }
      }
      if (status === "confirmed") {
        const res = await apiRegisterPartner.updateRegisterPartnerByAdmin(
          data?.id,
          { status: status }
        );
        if (res?.status === "OK") {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Chấp nhận người đồng hành thành công!",
            confirmButtonText: "OK",
          });
          handleCloseAppove?.();
          setAction((prev) => !prev);
        }
      }
    }
  };

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
          <h3
            className={` font-semibold text-[-20]   ${data?.status === "request" ? "text-green-500" : data?.status === "rejected" ? "text-red-600" : "text-primary"}`}
          >
            {data?.status === "request"
              ? "Đang chờ phê duyệt"
              : data?.status === "rejected"
                ? "Đã từ chối"
                : "Đã phê duyệt"}
          </h3>
        </div>
        <div className="mt-4 flex flex-col gap-4 p-4 border border-gray-500 rounded-2xl ">
          <h3 className="text-[-18] font-semibold">
            Thông tin tài khoản trong hệ thống
          </h3>
          <div className="flex gap-4">
            {/* Họ */}
            <div className="flex flex-col gap-1 w-1/2">
              <p className="font-semibold text-sm">Họ</p>
              <input
                type="text"
                value={data?.user?.lastName}
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
                value={data?.user?.firstName}
                className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Email</p>
            <input
              type="text"
              placeholder="Email"
              value={data?.user?.email}
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
              value={data?.user?.phone}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4 p-4 border border-gray-500 rounded-2xl">
          <h3 className="text-[-18] font-semibold">Thông tin đăng kí</h3>

          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">Họ và tên</p>
            <input
              type="text"
              placeholder="name"
              value={data?.name}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-[200px] text-[-14]">
              Số căn cước công dân
            </p>
            <input
              type="text"
              value={data?.numberCCCD}
              className="border w-full border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            {/* Ảnh 1 */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Mặt trước CCCD</p>
              <img
                src={data?.beforeImage}
                alt="Ảnh 1"
                className="w-[200px] h-[150px] object-contain object-center rounded-md border"
              />
            </div>

            {/* Ảnh 2 */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Mặt sau CCCD</p>
              <img
                src={data?.afterImage}
                alt="Ảnh 2"
                className="w-[200px] h-[150px] object-contain object-center rounded-md border"
              />
            </div>
          </div>
        </div>
        {data?.status === "request" ? (
          <div className="flex justify-end items-center mt-8 gap-4">
            <button
              className="py-2 px-8 bg-red-700 text-white w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
              onClick={() => {
                handleAction("rejected");
              }}
            >
              Từ chối
            </button>
            <button
              className="py-2 px-8 bg-green-700 text-white w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
              onClick={() => {
                handleAction("confirmed");
              }}
            >
              Phê duyệt
            </button>

            <button
              className="py-2 px-8 bg-gray-200 text-black w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
              onClick={() => {
                handleCloseAppove?.();
              }}
            >
              Đóng
            </button>
          </div>
        ) : data?.status === "rejected" ? (
          <div className="flex justify-end items-center mt-8 gap-4">
            <button
              className="py-2 px-8 bg-green-700 text-white w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
              onClick={() => {
                handleAction("confirmed");
              }}
            >
              Phê duyệt lại
            </button>

            <button
              className="py-2 px-8 bg-gray-200 text-black w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
              onClick={() => {
                handleCloseAppove?.();
              }}
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="flex justify-end items-center mt-8 gap-4">
            <button
              className="py-2 px-8 bg-red-700 text-white w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
              onClick={() => {
                handleAction("rejected");
              }}
            >
              Từ chối lại
            </button>

            <button
              className="py-2 px-8 bg-gray-200 text-black w-fit rounded-3xl hover:bg-opacity-80 font-semibold"
              onClick={() => {
                handleCloseAppove?.();
              }}
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemRegisterPartnerAdminPage;
