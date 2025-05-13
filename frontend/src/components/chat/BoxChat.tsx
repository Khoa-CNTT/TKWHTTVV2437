"use client";

import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { RiRobot2Line } from "react-icons/ri";
import { HiExternalLink } from "react-icons/hi";
import apisChatBot from "@/apis/chatbot";
import { v4 as uuidv4 } from "uuid";

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

  // Hàm phát hiện và định dạng URL
  const detectAndFormatUrls = (text: string) => {
    // Tách văn bản và URL ra để xử lý riêng
    let processedText = text;
    const elements = [];

    // 1. Xử lý URL Cloudinary (ảnh)
    const cloudinaryUrlPattern = /https:\/\/res\.cloudinary\.com\/[^\s"')]+/gi;
    const cloudinaryUrls = [];
    let match;

    while ((match = cloudinaryUrlPattern.exec(text)) !== null) {
      cloudinaryUrls.push(match[0]);
      processedText = processedText.replace(match[0], "");
    }

    // 2. Xử lý URLs localhost (chuyển tiếp)
    const localhostUrlPattern = /(http:\/\/localhost:[0-9]+\/[^\s"'),.]+)/gi;
    const localhostUrls = [];

    while ((match = localhostUrlPattern.exec(text)) !== null) {
      localhostUrls.push(match[0]);
      processedText = processedText.replace(match[0], "");
    }

    // 3. Xử lý các URL khác (hiển thị dạng link)
    const otherUrlPattern =
      /(https?:\/\/(?!res\.cloudinary\.com)(?!localhost)[^\s"'),.]+)/gi;
    const otherUrls = [];

    while ((match = otherUrlPattern.exec(text)) !== null) {
      otherUrls.push(match[0]);
      processedText = processedText.replace(match[0], "");
    }

    // Nếu còn text thì hiển thị
    if (processedText.trim()) {
      elements.push(
        <span key="text" style={{ whiteSpace: "pre-line" }}>
          {processedText}
        </span>
      );
    }

    // Hiển thị URLs localhost
    localhostUrls.forEach((url, index) => {
      const urlParts = url.split("/");
      const pageName = urlParts[urlParts.length - 1]
        .replace(/-/g, " ")
        .split("?")[0]
        .replace(/\b\w/g, (char) => char.toUpperCase());

      elements.push(
        <a
          key={`localhost-${index}`}
          href={url}
          className="block my-2 text-blue-700 font-medium hover:underline break-all flex items-center gap-2 bg-blue-50 p-2 rounded-md border-l-4 border-blue-500"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = url;
          }}
        >
          <span className="inline-block text-blue-600">📄</span>
          <span className="inline-block">
            <span className="font-semibold">Xem chi tiết:</span> {pageName}
          </span>
        </a>
      );
    });

    // Hiển thị các URL khác
    otherUrls.forEach((url, index) => {
      elements.push(
        <a
          key={`external-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-1 text-blue-600 hover:underline break-all flex items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            window.open(url, "_blank", "noopener,noreferrer");
          }}
        >
          <HiExternalLink className="inline-block flex-shrink-0" />
          <span className="inline-block">{url}</span>
        </a>
      );
    });

    // Hiển thị ảnh Cloudinary
    if (cloudinaryUrls.length > 0) {
      elements.push(
        <div
          key="image-group"
          className={`my-3 grid gap-2 w-full ${
            cloudinaryUrls.length > 1
              ? cloudinaryUrls.length === 2
                ? "grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {cloudinaryUrls.map((url, imgIdx) => (
            <div key={imgIdx} className="flex justify-center">
              <img
                src={url}
                alt={`Image ${imgIdx + 1}`}
                className="rounded-lg shadow-md max-h-64 max-w-full object-cover border border-gray-200"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      );
    }

    return elements.length > 0 ? (
      elements
    ) : (
      <span style={{ whiteSpace: "pre-line" }}>{text}</span>
    );
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: inputValue, sender: "user" },
      ]);
      setInputValue("");

      // Add empty bot message (will show typing animation)
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

        // Provide fallback error message
        setMessages((prev) =>
          prev.map((message) =>
            message.id === prev.length
              ? {
                  ...message,
                  text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
                }
              : message
          )
        );
        return;
      }

      // Update bot message with response
      if (response?.answer) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === prev.length
              ? { ...message, text: response.answer }
              : message
          )
        );
      }
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full shadow-xl rounded-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-blue-700 p-4 flex items-center justify-between text-white">
        <h1 className="font-semibold flex items-center gap-2">
          <RiRobot2Line size={30} className="text-white" />
          <span>Chat Bot</span>
        </h1>

        <IoClose
          onClick={() => onSetBox(false)}
          size={27}
          className="cursor-pointer hover:opacity-80"
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <ul className="space-y-4 py-2">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <div className="flex-shrink-0 mr-2 mt-1">
                  <RiRobot2Line className="text-blue-700" size={24} />
                </div>
              )}

              <div
                className={`max-w-[75%] ${message.text.length === 0 && message.sender === "bot" && loading ? "py-2" : ""}`}
              >
                {loading &&
                message.text.length === 0 &&
                message.sender === "bot" ? (
                  <div className="flex gap-2 items-center bg-gray-200 px-4 py-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full animate-pulse bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full animate-pulse bg-blue-600 animation-delay-200"></div>
                    <div className="w-2 h-2 rounded-full animate-pulse bg-blue-600 animation-delay-400"></div>
                  </div>
                ) : message.text.length > 0 ? (
                  <div
                    className={`rounded-lg overflow-hidden ${
                      message.sender === "bot"
                        ? "bg-gray-200 text-black"
                        : "bg-blue-700 text-white"
                    }`}
                  >
                    <div className="px-4 py-2">
                      {detectAndFormatUrls(message.text)}
                    </div>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
        <button
          onClick={handleSendMessage}
          disabled={loading || !inputValue.trim()}
          className={`absolute top-[50%] right-[25px] ${
            loading || !inputValue.trim()
              ? "text-gray-400"
              : "text-blue-700 hover:text-blue-800"
          } translate-y-[-50%] cursor-pointer transition-colors`}
          aria-label="Send message"
        >
          <AiOutlineSend size={25} />
        </button>
      </div>
    </div>
  );
};

export default BoxChat;
