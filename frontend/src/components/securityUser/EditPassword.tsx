"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import InputText from "../input/InputText";
import ButtonLogin from "../button/ButtonLogin";

import * as React from "react";
import InputForm from "../login/InputForm";
import validate from "@/utils/validateInput";
import { useAuth } from "@/app/contexts/AuthContext";
import apiUser from "@/api/user";
import Swal from "sweetalert2";

interface IEditPassword {
  password: string;
  confirmPassword: string;
}

interface IInvalidField {
  name: string;
  mes: string;
}

const EditPassword = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [dataEditPass, setDataEditPass] = useState<IEditPassword>({
    password: "",
    confirmPassword: "",
  });

  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);

  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  useEffect(() => {
    setIsCounting(true);
    setCountdown(30);
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCounting && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0 && isCounting) {
      setIsCounting(false);
    }

    return () => clearTimeout(timer);
  }, [countdown, isCounting]);
  const closeModal = () => {
    // Xoá query khi đóng modal
    router.push(pathname);
  };

  const itemsLabelForm = [
    {
      id: 1,
      title: "Hãy xác nhận email của bạn",
      label: `Nhập mã bảo mật mà chúng tôi đã gửi đến ${user?.email} Kiểm tra thư rác nếu không có trong hộp thư đến của bạn.`,
    },
    {
      id: 2,
      title: "Nhập mật khẩu mới của bạn",
      label: `Email:  ${user?.email}`,
    },
  ];

  const handleVerifyOtp = async () => {
    const invalids = validate({ otp: otp }, setInvalidFields);
    if (invalids === 0) {
      try {
        if (user?.email) {
          const respone = await apiUser.verifyOTP({
            email: user?.email,
            OTP: otp,
          });

          if (
            respone?.status === "OK" &&
            respone?.msg === "OTP verified successfully"
          ) {
            setStep(1);
          } else {
            console.log("OTP sai"); // OTP sai
          }
        }
      } catch (error) {
        console.error("Failed to verify OTP:", error);
        console.log(2); // Lỗi khi gọi API
      }
    }
  };

  const handdleOnSendAgainOTP = async () => {
    if (user) {
      const respone = await apiUser.sendOtpToEmail({ email: user?.email });
    }

    setIsCounting(true);
    setCountdown(30);
  };

  const handleSubmitEdit = async () => {
    const invalids = validate({ ...dataEditPass }, setInvalidFields);
    if (invalids === 0) {
      const token = localStorage.getItem("access_token");

      if (user?.id && token) {
        const res = await apiUser.updateUser(user?.id, token, {
          password: dataEditPass?.password,
        });
        if (res?.status === "OK" && res?.msg === "Update") {
          Swal.fire({
            title: "Thay đổi mật khẩu thành công!",
            icon: "success",
            allowOutsideClick: true,
            allowEscapeKey: true,
            allowEnterKey: true,
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });

          closeModal();
        }
      }
    }
  };

  const handleOnChangeDataRegister = (
    key: keyof IEditPassword,
    value: string
  ) => {
    setDataEditPass((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
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
          <div className="w-1/5">
            {step === 0 && (
              <div>
                <InputForm
                  titleHeader={itemsLabelForm[step].title}
                  labelHeader={itemsLabelForm[step].label}
                  labelBtn="Verify OTP"
                  labelInput="6-digit code"
                  typeInput="text"
                  idInput="otp"
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  onClick={handleVerifyOtp}
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
                />

                <div className="mt-5 relative">
                  <ButtonLogin
                    text={
                      isCounting
                        ? `Send again OTP ${countdown}`
                        : `Send again OTP`
                    }
                    inForm={false}
                    disable={isCounting}
                    onClick={handdleOnSendAgainOTP}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="text-2xl font-semibold py-6">
                  {itemsLabelForm[step].title}
                </h1>
                <p className="text-sm mb-6">{itemsLabelForm[step].label}</p>
                <div className="flex flex-col gap-4">
                  <InputText
                    value={dataEditPass.password}
                    type="password"
                    label="Mật khẩu mới"
                    id="password"
                    onChange={(value) =>
                      handleOnChangeDataRegister("password", value)
                    }
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />
                  <InputText
                    value={dataEditPass.confirmPassword}
                    type="password"
                    label="Xác nhận lại mật khẩu"
                    id="confirmPassword"
                    onChange={(value) =>
                      handleOnChangeDataRegister("confirmPassword", value)
                    }
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />

                  <div className="mt-5">
                    <ButtonLogin text="Countinue" onClick={handleSubmitEdit} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPassword;
