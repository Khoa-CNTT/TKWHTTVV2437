export default async function Page() {
  return (
    <div>
      <div className="max-w-3xl mx-auto bg-[#fefcf7] p-8 rounded-lg shadow-md border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#5a4a3f]">
          Điều khoản và Hướng dẫn đăng ký dịch vụ làm Chủ Homestay/Resort
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#5a4a3f]">
            Thứ nhất: Hướng dẫn đăng ký
          </h2>
          <p className="mb-3 text-[#333333]">
            Để đăng ký trở thành Chủ Homestay/Resort trên nền tảng của chúng
            tôi, vui lòng thực hiện theo các bước sau:
          </p>
          <div className="list-disc list-inside space-y-2 text-[#333333]">
            <div>
              Gọi điện thoại đến số hotline:{" "}
              <span className="font-semibold text-[#8b6d5c]">0707 560 285</span>{" "}
              để được hỗ trợ và tư vấn chi tiết.
            </div>
            <div>
              Chuẩn bị các giấy tờ và thông tin cần thiết theo hướng dẫn của
              nhân viên tư vấn.
            </div>
            <div>Hoàn tất thủ tục đăng ký và ký hợp đồng hợp tác.</div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#5a4a3f]">
            Thứ hai: Điều khoản và nội quy
          </h2>
          <p className="mb-3 text-[#333333]">
            Khi đăng ký làm Chủ Homestay/Resort trên hệ thống, quý khách đồng ý
            tuân thủ các điều khoản và nội quy sau:
          </p>
          <div className="list-disc list-inside space-y-2 text-[#333333]">
            <div>
              Chủ Homestay/Resort phải đảm bảo các thông tin cung cấp là chính
              xác và cập nhật.
            </div>
            <div>
              Cam kết giữ gìn, bảo trì homestay trong trạng thái tốt để đảm bảo
              trải nghiệm khách hàng.
            </div>
            <div>
              Nghiêm túc tuân thủ các quy định về phòng cháy chữa cháy và an
              toàn lao động.
            </div>
            <div>
              Tôn trọng và phối hợp cùng nền tảng để giải quyết các vấn đề phát
              sinh.
            </div>
            <div>
              Nền tảng có quyền từ chối hoặc chấm dứt hợp tác nếu phát hiện vi
              phạm điều khoản.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
