import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

import notfound from "../assets/images/not-found.png";

export const metadata: Metadata = {
  title: "Love trip: Hệ thống đặt phòng",
  description:
    "Hiện nay, Love trip đang ngày càng phát triển hơn nữa với các chương trình đặc sắc, các khuyến mãi hấp dẫn, đem đến cho khách hàng những trải nghiệm tuyệt vời nhất.",
};

export default function NotFound() {
  return (
    <Image className="my-10 mx-auto mt-10" src={notfound} alt="404"></Image>
  );
}
