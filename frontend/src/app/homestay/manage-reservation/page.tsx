import { FaCaretDown } from "react-icons/fa";

const ManageReservationPage = () => {
  return (
    <div className="w-full">
      <div className="p-10">
        <h1 className="text-2xl font-bold ">Quản lí đơn đặt phòng</h1>
        <div className="flex justify-between items-center mt-10">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-500 font-semibold rounded-xl bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-100">
              All Booking
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-500 font-semibold rounded-xl bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-100">
              Loại phòng
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-500 font-semibold rounded-xl bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-100">
              Trạng thái
              <span>
                <FaCaretDown />
              </span>
            </button>
          </div>
          <div>
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-500 font-semibold rounded-xl bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-100">
              All Booking
              <span>
                <FaCaretDown />
              </span>
            </button>
          </div>
        </div>
        <div className="overflow-hidden mt-8 rounded-xl">
          <table className="min-w-full text-black ">
            <thead className="bg-gray-200 text-[-14] text-gray-500 font-bold ">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-left ">Loại phòng</th>
                <th className="px-4 py-3 text-left ">Tên khách hàng</th>
                <th className="px-4 py-3 text-left ">Check In</th>
                <th className="px-4 py-3 text-left ">Check Out</th>
                <th className="px-4 py-3 text-left ">Tổng tiền</th>
                <th className="px-4 py-3 text-left ">Trạng thái</th>
                <th className="px-4 py-3 text-left ">...</th>
              </tr>
            </thead>
            <tbody className=" text-[-14] font-semibold ">
              <tr className="border-b border-gray-200">
                <td className="px-4 py-5">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-5">1</td>
                <td className="px-4 py-5">Single Single</td>
                <td className="px-4 py-5">
                  <div className="w-fit flex items-center gap-2 border border-b-[3px] border-gray-400 rounded-3xl py-1 px-3">
                    <img
                      src="https://a0.anyrgb.com/pngimg/1236/14/no-facial-features-no-avatar-no-eyes-expressionless-avatar-icon-delayering-avatar-user-avatar-men-head-portrait-thumbnail.png"
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                    <p>Thịnh trần</p>
                  </div>
                </td>
                <td className="px-4 py-5">12/12/2022</td>
                <td className="px-4 py-5">22/22/2022</td>
                <td className="px-4 py-5 ">1000000đ</td>

                <td className="px-4 py-5">isPending</td>
                <td className="px-4 py-5 ">⋯</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageReservationPage;
