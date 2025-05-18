"use client";

import { useState } from "react";
import { SiChatbot } from "react-icons/si";
import BoxChat from "./BoxChat";

const IconChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShowBox = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer">
      <SiChatbot onClick={handleShowBox} size={30} />

      {isOpen && (
        <div className="absolute bottom-0 right-[70px] w-[400px] h-[600px] bg-white shadow-lg rounded-lg transition duration-300 ease-in-out overflow-hidden">
          <BoxChat onSetBox={handleShowBox} />
        </div>
      )}
    </div>
  );
};

export default IconChat;
