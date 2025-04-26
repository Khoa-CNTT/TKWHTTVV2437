import { FaChevronRight } from "react-icons/fa";
interface SecurityField {
  title: string;
  label?: string;
  onClick?: () => void;
}

const SecurityField = ({ title, label, onClick }: SecurityField) => {
  return (
    <div
      className="w-full md:w-1/2 mt-4 px-3 py-3 border border-gray-300 rounded-2xl flex justify-between items-center cursor-pointer"
      onClick={onClick}
    >
      <div>
        <h3 className="text-[-14] text-[text] font-semibold">{title}</h3>

        <p className="text-[-14] text-[text]">{label}</p>
      </div>
      <span>
        <FaChevronRight />
      </span>
    </div>
  );
};

export default SecurityField;
