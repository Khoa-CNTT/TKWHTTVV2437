import main_logo from "@/assets/images/main_icon.png";
import Image from "next/image";

const data = [
  {
    title: "Về chúng tôi",
    items: [
      {
        title: "Giới thiệu về chúng tôi",
        // link: "/about"
      },
      {
        title: "Điều khoản sử dụng",
        // link: "/terms"
      },
      {
        title: "Chính sách bảo mật",
        // link: "/privacy"
      },
      {
        title: "Liên hệ với chúng tôi",
        // link: "/contact"
      },
    ],
  },
  {
    title: "Dịch vụ",
    items: [
      {
        title: "Homestay",
        // link: "/rent"
      },
      {
        title: "Resort",
        // link: "/rent"
      },
      {
        title: "Blog",
        // link: "/blog"
      },
      {
        title: "Tin tức",
        // link: "/news"
      },
    ],
  },
  {
    title: "Trợ giúp",
    items: [
      {
        title: "Hướng dẫn",
        // link: "/support"
      },
      {
        title: "Câu hỏi thường gặp",
        // link: "/faq"
      },
      {
        title: "Những điều cần biết",
        // link: "/contact"
      },
    ],
  },
];

const Footer = () => {
  return (
    <div className="border-t-2 border-gray-200 py-10 mt-10">
      <div className="w-[1260px] mx-auto">
        <div className="flex mt-4">
          <div className="w-1/4 flex flex-col items-center justify-center">
            <Image src={main_logo} alt="logo" width={100} height={100} />
            <h2 className="text-2xl font-bold text-blue-800 mt-2">LoveTrip</h2>
          </div>
          {data.map((item, index) => (
            <div key={index} className="w-1/4 flex justify-center">
              <div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <ul className="mt-2">
                  {item.items.map((item, index) => (
                    <li className="text-gray-500 text-sm py-1" key={index}>
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
