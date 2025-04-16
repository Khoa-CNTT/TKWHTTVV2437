"use client";
import { FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface IButtonSidebar {
  title: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  isActive: boolean;
}
const ButtonSidebar = ({
  title,
  label,
  icon,
  path,
  isActive,
}: IButtonSidebar) => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(`/account/${path}`);
  };
  return (
    <div
      className={`w-full py-3 px-2 border border-gray-200 rounded-2xl cursor-pointer ${isActive && "border-primary border-2"}`}
      onClick={() => handleNavigate(path)}
    >
      <div className="flex justify-between items-center pr-3">
        <div className="flex gap-3 items-center ">
          <span className="py-3 pl-3 text-2xl ">{icon}</span>
          <div className="pr-3">
            <p className="text-[text] font-semibold">{title}</p>
            <p className="text-[-12] text-[text] leading-4">{label}</p>
          </div>
        </div>
        <span>
          <FaChevronRight />
        </span>
      </div>
    </div>
  );
};

export default ButtonSidebar;
