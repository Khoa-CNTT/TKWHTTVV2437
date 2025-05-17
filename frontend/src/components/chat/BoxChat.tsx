"use client";

import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { RiRobot2Line } from "react-icons/ri";
import { HiExternalLink } from "react-icons/hi";
import apisChatBot from "@/apis/chatbot";
import { v4 as uuidv4 } from "uuid";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown";

interface IProps {
  onSetBox: (value: boolean) => void;
}

interface IMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ApiResponse {
  answer: string;
  fromCache: boolean;
  queryTimeMs: number;
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

  const components: Components = {
    a: ({ node, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      />
    ),
    pre: ({ node, ...props }) => (
      <pre
        {...props}
        className="bg-gray-100 p-2 rounded my-2 overflow-x-auto"
      />
    ),
    p: ({ node, ...props }) => <p {...props} className="my-2" />,
    ul: ({ node, ...props }) => (
      <ul {...props} className="list-disc pl-5 my-2" />
    ),
    ol: ({ node, ...props }) => (
      <ol {...props} className="list-decimal pl-5 my-2" />
    ),
    li: ({ node, ...props }) => <li {...props} className="my-1" />,
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

      let response: ApiResponse;
      try {
        setLoading(true);
        response = await apisChatBot.getMessage(inputValue.trim(), uuidv4());
        setLoading(false);

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
                    <div className="px-4 py-2 prose prose-sm max-w-none">
                      <Markdown
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm]}
                        components={components}
                      >
                        {message.text}
                      </Markdown>
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
