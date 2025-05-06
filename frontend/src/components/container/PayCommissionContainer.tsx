const PayCommissionContainer = () => {
  return (
    <div className="border-gray-300 border rounded-md p-4">
      <h4 className="text-center font-semibold">Thanh toán tiền hoa hồng</h4>

      <p className="mt-4">Ngày thanh toán gần nhất:</p>
      <p> 17:30 2/2/2025</p>

      <ul className="mt-4">
        <li className="mt-2">
          <div className="flex items-center justify-between">
            <p>Doanh thu tháng 4:</p>
            <p className="text-semibold">20000000</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Phí tháng 4 (7%):</p>
            <p className="text-semibold">20000</p>
          </div>
        </li>

        <li className="mt-2">
          <div className="flex items-center justify-between">
            <p>Doanh thu tháng 4:</p>
            <p className="text-semibold">20000000</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Phí tháng 4 (7%):</p>
            <p className="text-semibold">20000</p>
          </div>
        </li>
      </ul>

      <div className="border-t border-gray-300 mt-2 pt-2">
        <div className="flex items-center justify-between">
          <p>Tổng tiền thanh toán:</p>
          <p className="text-red-500 font-semibold">2000000</p>
        </div>

        <button className="w-full py-2 text-white bg-red-600 rounded-md hover:opacity-90 mt-4">
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default PayCommissionContainer;
