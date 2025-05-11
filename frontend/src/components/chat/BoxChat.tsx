"use client";

import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import clsx from "clsx";
import { RiRobot2Line } from "react-icons/ri";
import apisChatBot from "@/apis/chatbot";
import { v4 as uuidv4 } from "uuid";

// uuidv4()

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
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add URL detection function
  const detectAndFormatUrls = (text: string) => {
    // Loại bỏ dấu ngoặc vuông quanh URL nếu có
    const cleanedText = text.replace(
      /\[(https?:\/\/res\.cloudinary\.com[^\]]+)\]/g,
      "$1"
    );
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = cleanedText.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        let url = part;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }
        // Nếu là Cloudinary URL thì hiển thị ảnh inline
        if (url.includes("res.cloudinary.com")) {
          return (
            <img
              key={index}
              src={url}
              alt="Cloudinary image"
              className="inline-block max-h-60 max-w-xs rounded-lg shadow-md align-middle mx-1"
              style={{ verticalAlign: "middle" }}
            />
          );
        }
        // Các URL khác vẫn là link
        try {
          new URL(url);
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              {part}
            </a>
          );
        } catch {
          return part;
        }
      }
      return part;
    });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: inputValue, sender: "user" },
      ]);
      setInputValue("");

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: "", sender: "bot" },
      ]);

      let response;
      try {
        setLoading(true);

        response = await apisChatBot.getMessage(inputValue.trim(), uuidv4());
        setLoading(false);
      } catch (e) {
        console.log("error", e);
        setLoading(false);
      }

      if (response?.answer) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === prev.length
              ? { ...message, text: response.answer } // Cập nhật thuộc tính text (giữ nguyên các thuộc tính khác)
              : message
          )
        );
      }
    }
  };

  // Thêm useEffect để scroll xuống dưới cùng khi messages thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Chat messages will go here */}
        <ul>
          {messages.map((message, index) => (
            <li key={index} className="mt-2 flex items-center gap-2">
              {message.sender === "bot" && (
                <div className="flex items-center gap-2">
                  <RiRobot2Line className="text-black" size={25} />
                  {loading && message.text.length === 0 && (
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse bg-blue-600"></div>
                      <div className="w-2 h-2 rounded-full animate-pulse bg-blue-600"></div>
                      <div className="w-2 h-2 rounded-full animate-pulse bg-blue-600"></div>
                    </div>
                  )}
                </div>
              )}
              {message.text.length > 0 && (
                <span
                  className={clsx(
                    "bg-blue-700 max-w-[70%] block px-4 py-2 rounded-md break-words",
                    {
                      "bg-gray-200 text-black": message.sender === "bot", // Tin nhắn từ bot
                      "bg-blue-700 text-white ml-auto":
                        message.sender === "user", // Tin nhắn từ user
                    }
                  )}
                >
                  {detectAndFormatUrls(message.text)}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef} />
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
