"use client";
import apiReservation from "@/api/reservation";
import { useRouter } from "next/navigation";
import { FaUserEdit } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { RiDeviceRecoverFill } from "react-icons/ri";
import Swal from "sweetalert2";

interface IProps {
  id: string;
  statusUser: string;
  status: string;
}

const ActionMyTrip = ({ id, statusUser, status }: IProps) => {
  const router = useRouter();

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: `Bạn có chắc muốn ${statusUser === "created" ? "hủy" : "khôi phục"} phòng này chứ?`,
      text: `Thao tác này sẽ ${statusUser === "created" ? "hủy" : "khôi phục"} đơn đặt phòng của bạn.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) {
      if (statusUser === "created") {
        const res = await apiReservation.updateInfoReservation({
          id: id,
          statusUser: "canceled",
        });
        if (res?.status === "OK") {
          await Swal.fire({
            title: "Đã hủy phòng!",
            icon: "success",
            confirmButtonText: "OK",
          });

          router.refresh(); // Refresh lại dữ liệu mới
        }
      } else if (statusUser === "canceled") {
        const res = await apiReservation.updateInfoReservation({
          id: id,
          statusUser: "created",
        });
        if (res?.status === "OK") {
          await Swal.fire({
            title: "Đã hủy phòng!",
            icon: "success",
            confirmButtonText: "OK",
          });

          router.refresh(); // Refresh lại dữ liệu mới
        }
      }
    }
  };

  const handleEditClick = () => {
    router.push("?edit=info");
  };
  return (
    <div>
      <div className="border rounded-lg shadow p-6 flex flex-col gap-4">
        <p className="font-semibold">Tất cả các thông tin có đúng không?</p>
        <div
          className={`flex items-center text-primary font-semibold underline gap-1 ${status === "waiting" ? "cursor-pointer hover:opacity-70 w-fit" : "cursor-not-allowed hover:opacity-70 w-fit relative group"} `}
          onClick={status === "waiting" ? handleCancel : undefined}
        >
          <span className="w-4 h-4">
            {statusUser === "created" ? (
              <IoMdCloseCircle />
            ) : (
              <RiDeviceRecoverFill />
            )}
          </span>
          <span>
            {" "}
            {statusUser === "created"
              ? "Huỷ đặt phòng ?"
              : "Khôi phục lại phòng"}
          </span>
          {/* Tooltip */}
          <div className="absolute top-full left-0 mt-1 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition duration-200 z-10">
            Đơn phòng đã xác nhận không thể hành động
          </div>
        </div>
        <div
          className={`flex items-center text-primary font-semibold underline gap-1 ${status === "waiting" ? "cursor-pointer hover:opacity-70 w-fit" : "cursor-not-allowed hover:opacity-70 w-fit relative group"}`}
          onClick={status === "waiting" ? handleEditClick : undefined}
        >
          <span className="w-4 h-4">
            <FaUserEdit />
          </span>
          <div className="absolute top-full left-0 mt-1 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition duration-200 z-10">
            Đơn phòng đã xác nhận không thể hành động
          </div>
          <span>Xem và chỉnh sửa thông tin của bạn?</span>
        </div>
      </div>
    </div>
  );
};

export default ActionMyTrip;
