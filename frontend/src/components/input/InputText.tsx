"use client";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
interface IInvalidField {
  name: string;
  mes: string;
}

interface IInputText {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange?: (value: string) => void;
  invalidFields?: IInvalidField[];
  setInvalidFields?: React.Dispatch<React.SetStateAction<IInvalidField[]>>;
  disable?: boolean;
}

const InputText = (props: IInputText) => {
  const {
    id,
    label,
    type = "text",
    placeholder = "",
    required = false,
    onChange,
    value,
    invalidFields,
    setInvalidFields,
    disable,
  } = props;

  const [lock, setLock] = useState(true);

  const handleFocus = () => {
    // onChange?.("");
    if (setInvalidFields) {
      setInvalidFields([]);
    }
  };

  const handleLock = () => {
    setLock(!lock);
  };
  return (
    <div className="relative">
      <input
        disabled={disable === true ? true : false}
        type={lock ? type : "text"}
        value={value}
        id={id}
        placeholder={placeholder}
        className={`peer w-full   border border-gray-400  rounded-xl px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={handleFocus}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-1 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {(id === "password" || id === "confirmPassword") && value !== "" && (
        <span
          className="absolute right-4 top-4 z-10 bg-white cursor-pointer w-6 h-6 flex items-center justify-center"
          onClick={handleLock}
        >
          {lock ? (
            <FaEyeSlash key="eye-slash" />
          ) : (
            <IoEyeSharp key="eye-sharp" />
          )}
        </span>
      )}

      {/* <IoEyeSharp /> */}
      {invalidFields?.some((el) => el.name === id) && (
        <p className="mt-0.5 text-[-12] text-red-600 italic">
          {invalidFields.find((el) => el.name === id)?.mes}
        </p>
      )}
    </div>
  );
};

export default InputText;
