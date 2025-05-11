// "use client"
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import apisAdmin from "@/api/admin";
// import dayjs from "dayjs";
// import { showErrorAlert } from "@/helper/Alert";
// import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS
// import { FaSyncAlt, FaTimes, FaEye, FaUser, FaEnvelope, FaCreditCard, FaDoorOpen, FaClock } from "react-icons/fa";
// interface IUser {
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// interface IRoom {
//   id: string;
//   idProperty: string;
//   name: string;
//   description: string;
//   maxPerson: number;
//   price: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface IReservation {
//   totalPrice: number;
//   Rooms?: IRoom;
// }

// interface IPayment {
//   id: string;
//   idReservation: string;
//   idUser: string;
//   paymentDate: string;
//   paymentMethod: string;
//   paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
//   createdAt: string;
//   updatedAt: string;
//   Users?: IUser;
//   Reservations?: IReservation;
// }
// interface PaymentDetailModalProps {
//   payment: IPayment;
//   onClose: () => void;
// }

// // Props cho DetailItem
// interface DetailItemProps {
//   label: string;
//   value: React.ReactNode;
//   icon?: React.ReactElement;
// }
// const getStatusBadge = (status: string) => {
//   switch (status) {
//     case "Completed":
//       return "bg-green-100 text-green-700";
//     case "Pending":
//       return "bg-yellow-100 text-yellow-700";
//     case "Failed":
//       return "bg-red-100 text-red-700";
//       case "Refunded":
//         return "bg-orange-100 text-orange-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };
// const PaymentContainer: React.FC = () => {
//   const router = useRouter();
//   const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
//   const [payments, setPayments] = useState<IPayment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortField, setSortField] = useState<keyof IPayment>("createdAt");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//   const rowsPerPage = 10;
//   const [filterStatus, setFilterStatus] = useState<string>("all");
//   const [dateFilter, setDateFilter] = useState<{
//     type: 'paymentDate' | 'createdAt' | '';
//     value: string;
//   }>({ type: '', value: '' });
//   // Trong hàm fetchPayments
//  const fetchPayments = async () => {
//   try {
//     setLoading(true); // Bật trạng thái loading khi bắt đầu fetch
//     const response = await apisAdmin.listPayments();
//     const mappedPayments: IPayment[] = response.data.map((payment: IPayment) => ({
//       ...payment,
//       User: payment.Users || null,
//       Reservation: payment.Reservations || null
//     }));
//     setPayments(mappedPayments);
//   } catch (error) {
//     showErrorAlert("Không thể tải danh sách thanh toán");
//   } finally { // Luôn chạy dù thành công hay thất bại
//     setLoading(false); // Tắt loading
//   }
// };
//   useEffect(() => {
//     fetchPayments();
//     const testFetch = async () => {
//       const res = await apisAdmin.listPayments();
//       console.log("API response structure:", res.data[0]); // Xem cấu trúc thực tế
//     };
//     testFetch();
//   }, []);

//   const handleSort = (field: keyof IPayment) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };

//   const filteredData = payments
//     .filter(payment => {
//       // Filter trạng thái
//       const statusMatch = filterStatus === "all" ||
//         payment.paymentStatus === filterStatus;

//       // Filter ngày
//       let dateMatch = true;
//       if (dateFilter.type && dateFilter.value) {
//         const paymentDate = dayjs(payment[dateFilter.type]).format('YYYY-MM-DD');
//         dateMatch = paymentDate === dateFilter.value;
//       }

//       // Filter search
//       const searchMatch = [
//         payment.idReservation,
//         payment.Users?.email,
//         payment.Reservations?.Rooms?.name
//       ].some(value => value?.toLowerCase().includes(searchTerm.toLowerCase()));

//       return statusMatch && dateMatch && searchMatch;
//     })
//     .sort((a, b) => { /* Giữ nguyên logic sort */
//       const valueA = a[sortField];
//       const valueB = b[sortField];

//       // Xử lý riêng cho trường ID
//       if (sortField === "id") {
//         const numA = parseInt(valueA as string); // Ép kiểu vì TS không nhận diện được
//         const numB = parseInt(valueB as string);
//         return sortOrder === "asc" ? numA - numB : numB - numA;
//       }

//       // Xử lý các trường string khác
//       if (typeof valueA === "string" && typeof valueB === "string") {
//         return sortOrder === "asc"
//           ? valueA.localeCompare(valueB)
//           : valueB.localeCompare(valueA);
//       }

//       return 0;
//     });

//   const indexOfLast = currentPage * rowsPerPage;
//   const indexOfFirst = indexOfLast - rowsPerPage;
//   const currentPayments = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex gap-2 mb-6">
//         {/* Filter trạng thái */}
//         <div className="flex gap-2">
//           <button
//             className={`px-4 py-2 rounded-full text-sm ${filterStatus === "all"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 hover:bg-gray-300"
//               }`}
//             onClick={() => setFilterStatus("all")}
//           >
//             Tất cả
//           </button>
//           {["Pending", "Completed", "Failed"].map(status => (
//             <button
//               key={status}
//               className={`px-4 py-2 rounded-full text-sm ${filterStatus === status
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//                 }`}
//               onClick={() => setFilterStatus(status)}
//             >
//               {status}
//             </button>
//           ))}
//         </div>

//         {/* Filter ngày */}
//         <div className="flex gap-2">
//           <select
//             className="border rounded px-2 py-2 text-sm"
//             value={dateFilter.type}
//             onChange={(e) => setDateFilter(prev => ({
//               ...prev,
//               type: e.target.value as any
//             }))}
//           >
//             <option value="paymentDate">Ngày thanh toán</option>

//         {/* Filter ngày */}
//         <div className="flex gap-2">
//           <select
//             className="border rounded px-2 py-2 text-sm"
//             value={dateFilter.type}
//             onChange={(e) => setDateFilter(prev => ({
//               ...prev,
//               type: e.target.value as  'paymentDate' | 'createdAt' | ''
//             }))}
//           >
//             <option value="paymentDate">Ngày thanh toán</option>

//           </select>
//           <input
//             type="date"
//             className="border rounded px-4 py-2 text-sm"
//             value={dateFilter.value}
//             onChange={(e) => setDateFilter(prev => ({
//               ...prev,
//               value: e.target.value
//             }))}
//           />
//           {dateFilter.type && (
//             <button
//               className="px-2 text-red-500 hover:text-red-700"
//               onClick={() => setDateFilter({ type: '', value: '' })}
//             >
//               <i className="fa fa-times"></i>
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Quản lý Thanh toán</h1>
//         <button
//           onClick={fetchPayments}
//           className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
//           title="Làm mới dữ liệu"
//         >
//           <FaSyncAlt className="text-xl" />
//         </button>
//       </div>

//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Tìm kiếm theo mã đặt phòng, phương thức hoặc trạng thái..."
//           className="border rounded px-4 py-2 w-full md:w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <div className="text-center text-blue-500">Đang tải dữ liệu...</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-black">
//               <thead className="bg-gray-200 text-gray-500 font-bold text-sm">
//                 <tr>
//                   <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("id")}>
//                     ID {sortField === "id" && (sortOrder === "asc" ? "▲" : "▼")}
//                   </th>
//                   <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("idReservation")}>
//                     Mã đặt phòng {sortField === "idReservation" && (sortOrder === "asc" ? "▲" : "▼")}
//                   </th>
//                   <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("paymentMethod")}>
//                     Phương thức {sortField === "paymentMethod" && (sortOrder === "asc" ? "▲" : "▼")}
//                   </th>
//                   <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("paymentStatus")}>
//                     Trạng thái {sortField === "paymentStatus" && (sortOrder === "asc" ? "▲" : "▼")}
//                   </th>
//                   <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("paymentDate")}>
//                     Ngày thanh toán {sortField === "paymentDate" && (sortOrder === "asc" ? "▲" : "▼")}
//                   </th>
//                   <th className="px-4 py-3 text-left">Hành động</th>

//                 </tr>
//               </thead>
//               <tbody className="text-sm font-semibold">
//                 {currentPayments.map((payment) => (
//                   <tr
//                     key={payment.id}
//                     className="border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-4 py-5">{payment.id}</td>
//                     <td className="px-4 py-5">{payment.idReservation}</td>
//                     <td className="px-4 py-5">{payment.paymentMethod}</td>
//                     <td className="px-4 py-5">
//                       <span className={`px-2 py-1 rounded-full ${getStatusBadge(payment.paymentStatus)}`}>
//                         {payment.paymentStatus}
//                       </span>
//                     </td>
//                     <td className="px-4 py-5">
//                       {dayjs(payment.paymentDate).format("DD/MM/YYYY HH:mm")}
//                     </td>
//                     <td className="px-9 py-5">
//                       <i
//                         className="fa fa-eye text-gray-500 cursor-pointer hover:text-blue-700"
//                         onClick={() => setSelectedPayment(payment)}
//                       ></i>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {selectedPayment && (
//             <PaymentDetailModal
//               payment={selectedPayment}
//               onClose={() => setSelectedPayment(null)}
//             />
//           )}
//           <div className="flex justify-center items-center mt-4 gap-2">
//             <button
//               className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               &lt;
//             </button>
//             {Array.from({ length: totalPages }, (_, index) => (
//               <button
//                 key={index + 1}
//                 className={`px-3 py-1 rounded ${currentPage === index + 1
//                   ? "bg-orange-500 text-white"
//                   : "bg-gray-300 hover:bg-gray-400"
//                   }`}
//                 onClick={() => setCurrentPage(index + 1)}
//               >
//                 {index + 1}
//               </button>
//             ))}
//             <button
//               className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//             >
//               &gt;
//             </button>
//           </div>
//         </>
//       )}

//     </div>
//   );
// };
// const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon }) => (
//   <div className="flex items-start gap-3">
//     {icon && <div className="text-blue-600 mt-1">{icon}</div>}
//     <div>
//       <div className="text-sm text-gray-500 mb-1">{label}</div>
//       <div className="font-medium">{value}</div>
//     </div>
//   </div>
// );
// const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ payment, onClose }) => {

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
//       <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
//         <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             <FaCreditCard className="text-green-600" />
//             Chi tiết thanh toán
//           </h2>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//           >
//             <FaTimes className="text-xl" />
//           </button>
//         </div>

//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <DetailItem
//               label="Khách hàng"
//               value={`${payment.Users?.firstName || ''} ${payment.Users?.lastName || ''}`.trim() || 'N/A'}
//             />
//             <DetailItem
//               label="Mã đặt phòng"
//               value={payment.idReservation || 'N/A'}
//             />
//             <DetailItem
//               label="Email"
//               value={payment.Users?.email || 'N/A'}
//             />
//             <DetailItem
//               label="Phương thức"
//               value={
//                 <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                   {payment.paymentMethod || 'N/A'}
//                 </span>
//               }
//             />
//           </div>

//           <div className="space-y-4">
//             <DetailItem
//               label="Loại phòng"
//               value={payment.Reservations?.Rooms?.name || 'N/A'}
//             />
//             <DetailItem
//               label="Mô tả phòng"
//               value={payment.Reservations?.Rooms?.description || 'N/A'}
//             />
//             <DetailItem
//               label="Sức chứa"
//               value={`${payment.Reservations?.Rooms?.maxPerson || 'N/A'} người`}
//             />
//             <DetailItem
//               label="Giá phòng"
//               value={`${payment.Reservations?.Rooms?.price?.toLocaleString('vi-VN') || 'N/A'} VND`}
//             />
//             <DetailItem
//               label="Tổng thanh toán"
//               value={
//                 <div className="text-xl font-semibold text-green-600">
//                   {payment.Reservations?.totalPrice?.toLocaleString('vi-VN') || 'N/A'} VND
//                 </div>
//               }
//             />
//             <DetailItem
//               label="Thời gian thanh toán"
//               value={dayjs(payment.paymentDate).format("DD/MM/YYYY HH:mm") || 'N/A'}
//             />
//             <DetailItem
//               label="Trạng thái"
//               value={
//                 <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(payment.paymentStatus)}`}>
//                   {payment.paymentStatus || 'N/A'}
//                 </span>
//               }
//             />
//           </div>
//         </div>

//          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
//           >
//             Đóng
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentContainer;
