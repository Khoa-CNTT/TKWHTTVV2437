import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import clsx from "clsx";
import { RiRobot2Line } from "react-icons/ri";

interface IProps {
  onSetBox: (value: boolean) => void;
}

interface IMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const BoxChat: React.FC<IProps> = ({ onSetBox }) => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: 1,
      text: "Tôi có thể hỗ trợ bạn đặt phòng khách sạn với các thông tin chi tiết như sau:  \n\n### **1. December Hoi An Villa (Hội An)**  \n📍 **Địa chỉ:** 99 Phạm Văn Đồng, Tân An, Hội An  \n⭐ **Hạng sao:** 3 sao  \n💖 **Đánh giá cặp đôi:** 8.4/10  \n🌿 **Tiện ích nổi bật:**  \n- Hồ bơi ngoài trời, Wifi miễn phí  \n- Xe đạp miễn phí, bãi đậu xe riêng  \n- Nhà hàng phục vụ ẩm thực Mỹ, Việt, Âu  \n- Dịch vụ đưa đón sân bay, trông trẻ  \n\n**Phòng & Giá:**  \n- **Phòng Hai Giường Cổ Điển** (500,000 VNĐ/đêm, tối đa 2 người)  \n- **Phòng Cổ Điển** (300,000 VNĐ/đêm, 1 người)  \n\n---  \n\n### **2. Happy Day Riverside Hotel & Spa (Đà Nẵng)**  \n📍 **Địa chỉ:** 160 Bạch Đằng, Đà Nẵng  \n💖 **Đánh giá cặp đôi:** 9.6/10  \n🌿 **Tiện ích nổi bật:**  \n- Wifi miễn phí, gần chợ Hàn, cầu Rồng  \n- Dịch vụ spa, lễ tân 24/24  \n- Cách biển Phạm Văn Đồng 3km  \n\n**Phòng & Giá:**  \n- **Phòng Deluxe Giường King** (500,000 VNĐ/đêm, 2 người)  \n- **Phòng Hai Giường Hạng Sang** (600,000 VNĐ/đêm, 2 người)  \n\n### **Tôi có thể giúp bạn:**  \n✅ Tìm phòng phù hợp ngân sách & số lượng khách  \n✅ Kiểm tra ưu đãi (giảm giá Genius, bữa sáng...)  \n✅ Đặt phòng ngay hoặc tư vấn thêm  \n\nBạn muốn đặt phòng ở **Hội An** hay **Đà Nẵng**? Cần phòng cho bao nhiêu người và ngày nhận/phòng cụ thể? 😊",
      sender: "bot",
    },
    { id: 2, text: "Hi, I need assistance.", sender: "user" },
  ]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: inputValue, sender: "user" },
      ]);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-700 p-4 flex items-center justify-between text-white">
        <h1 className="font-semibold flex items-center gap-2">
          <RiRobot2Line size={30} className="text-white" />
          <span>Chat Bot</span>
        </h1>

        <IoClose
          onClick={() => onSetBox(false)}
          size={27}
          className="hover:opacity-80"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {/* Chat messages will go here */}
        <ul>
          {messages.map((message, index) => (
            <li key={index} className="mt-2 flex items-center gap-2">
              {message.sender === "bot" && (
                <RiRobot2Line className="text-black" size={25} />
              )}
              <span
                className={clsx(
                  "bg-blue-700 max-w-[70%] block px-4 py-2 rounded-md break-words",
                  {
                    "bg-gray-200 text-black": message.sender === "bot", // Tin nhắn từ bot
                    "bg-blue-700 text-white ml-auto": message.sender === "user", // Tin nhắn từ user
                  }
                )}
              >
                {message.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          className="w-full p-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          onClick={handleSendMessage}
          className="absolute top-[50%] right-[25px] text-blue-700 translate-y-[-50%]"
        >
          <AiOutlineSend size={25} />
        </div>
      </div>
    </div>
  );
};

export default BoxChat;
