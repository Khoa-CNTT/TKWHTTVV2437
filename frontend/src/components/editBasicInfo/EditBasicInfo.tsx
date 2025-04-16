"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import InputText from "../input/InputText";
import ButtonLogin from "../button/ButtonLogin";
const EditBasicInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("edit") === "basic-info";
  const [show, setShow] = useState(false);
  const genders = [
    { label: "Nữ", value: "Female" },
    { label: "Nam", value: "Male" },
    { label: "Không xác định (X)", value: "unspecified" },
    { label: "Không tiết lộ (U)", value: "undisclosed" },
  ];
  const [selectedGender, setSelectedGender] = useState<string>("");
  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  const closeModal = () => {
    // Xoá query khi đóng modal
    router.push(pathname);
  };

  if (!show) return null;
  return (
    <div>
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-white">
        <div className="p-5">
          <div
            onClick={closeModal}
            className="text-[30px] text-primary w-[50px] h-[50px] flex justify-center items-center rounded-[-50] hover:bg-blue-200 cursor-pointer"
          >
            <IoMdClose />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[480px] flex flex-col gap-4">
            <div className="">
              <h1 className="text-[text] text-[28px] font-semibold">
                Thông tin cá nhân
              </h1>
              <p className="text-[-14]  text-gray-500">
                Hãy đảm bảo thông tin này trùng khớp với giấy tờ tùy thân của
                bạn, như hộ chiếu hoặc giấy phép lái xe.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Họ và tên
              </p>
              <InputText
                id="firstName"
                label="First Name"
                type="text"
                value=""
              />
              <InputText
                id="middleName"
                label="Middle Name"
                type="text"
                value=""
              />
              <InputText id="lastName" label="Last Name" type="text" value="" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">Về bạn</p>
              <div>
                <InputText id="bio" label="Tiểu sử" type="text" value="" />
                {/* <div className="text-[-12] italic mx-2">
                  Giúp những người chủ nhà tương lai hiểu rõ hơn về bạn. Bạn có
                  thể chia sẻ phong cách du lịch, sở thích, mối quan tâm và
                  nhiều thứ khác.
                </div> */}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[-14] font-semibold text-gray-700">
                Ngày sinh
              </p>
              <div className="flex gap-3">
                <InputText id="day" label="Ngày" type="text" value="" />
                <InputText id="month" label="Tháng" type="text" value="" />
                <InputText id="year" label="Năm" type="text" value="" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[-14] font-semibold text-gray-700 ">
                Gender
              </h3>
              {genders.map((gender) => (
                <label
                  key={gender.value}
                  className="flex items-center gap-3 cursor-pointer "
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender.value}
                    checked={selectedGender === gender.value}
                    onChange={() => setSelectedGender(gender.value)}
                    className="form-radio text-blue-600 focus:ring-blue-500 w-[20px] h-[20px]"
                  />
                  <span className="">{gender.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <ButtonLogin text="Lưu thông tin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBasicInfo;
