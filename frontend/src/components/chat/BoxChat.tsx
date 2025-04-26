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
      text: "Xin chào tôi có thể hỗ trợ được gì cho bạn?",
      sender: "bot",
    },
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
