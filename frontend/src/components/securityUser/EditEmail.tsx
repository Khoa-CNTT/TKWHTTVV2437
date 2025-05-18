"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import InputText from "../input/InputText";
import ButtonLogin from "../button/ButtonLogin";

import * as React from "react";
import InputForm from "../login/InputForm";
import validate from "@/utils/validateInput";
import { useAuth } from "@/app/contexts/AuthContext";
import apiUser from "@/api/user";
import Swal from "sweetalert2";

interface IEditEmail {
  email: string;
  confirmEmail: string;
}

interface IInvalidField {
  name: string;
  mes: string;
}

const EditEmail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpNew, setOtpNew] = useState("");
  const [dataEditEmail, setDataEditEmail] = useState<IEditEmail>({
    email: "",
    confirmEmail: "",
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
      label: `Nhập mã bảo mật mà chúng tôi đã gửi đến ${user?.email}. Kiểm tra thư rác nếu không có trong hộp thư đến của bạn.`,
    },
    {
      id: 2,
      title: "Nhập email mới của bạn",
      label: `Email này cho phép bạn đăng nhập vào tài khoản của mình. Bạn cũng sẽ nhận được các cập nhật quan trọng cho hoạt động đặt chỗ và tài khoản của mình.`,
    },
    {
      id: 3,
      title: "Hãy xác nhận email mới của bạn",
      label: `Nhập mã bảo mật mà chúng tôi đã gửi đến ${dataEditEmail?.email}. Kiểm tra thư rác nếu không có trong hộp thư đến của bạn.`,
    },
  ];

  const handleVerifyOtp = async () => {
    const invalids = validate({ otp: otp }, setInvalidFields);
    if (invalids === 0) {
      try {
        if (user?.email) {
          const respone = await apiUser.verifyOTPLogin({
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
    if (user?.email) {
      const respone = await apiUser.sendOtpToEmail({
        email: dataEditEmail?.email,
      });
    }

    setIsCounting(true);
    setCountdown(30);
  };

  const handdleOnSendAgainOTPNew = async () => {
    if (dataEditEmail?.email) {
      const respone = await apiUser.sendOtpToEmail({
        email: dataEditEmail?.email,
        status: "change email",
      });
    }

    setIsCounting(true);
    setCountdown(30);
  };

  const handleSendOTPEmailNew = async () => {
    const invalids = validate({ ...dataEditEmail }, setInvalidFields);
    if (invalids === 0) {
      try {
        if (dataEditEmail?.email) {
          const respone = await apiUser.sendOtpToEmail({
            email: dataEditEmail?.email,
            status: "change email",
          });

          if (respone.status === "OK") {
            setStep(2);
          }
        }
      } catch (error) {
        console.error("Failed to verify OTP:", error);
        console.log("Lỗi khi gọi API send OTP"); // Lỗi khi gọi API
      }
    }
  };

  const handleVerifyOtpNew = async () => {
    const invalids = validate({ otp: otpNew }, setInvalidFields);
    if (invalids === 0) {
      try {
        if (dataEditEmail?.email) {
          const respone = await apiUser.verifyOTP({
            email: dataEditEmail?.email,
            OTP: otpNew,
          });

          if (
            respone?.status === "OK" &&
            respone?.msg === "OTP verified successfully"
          ) {
            const token = localStorage.getItem("access_token");

            if (user?.id && token) {
              const res = await apiUser.updateUser(user?.id, token, {
                email: dataEditEmail?.email,
              });
              if (res?.status === "OK" && res?.msg === "Update") {
                setUser((prev) =>
                  prev ? { ...prev, email: dataEditEmail?.email } : null
                );
                Swal.fire({
                  title: "Thay đổi email thành công!",
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
            } else {
              console.log("OTP sai"); // OTP sai
            }
          }
        }
      } catch (error) {
        console.error("Failed to verify OTP:", error);
        console.log(2); // Lỗi khi gọi API
      }
    }
  };

  const handleOnChangeDataRegister = (key: keyof IEditEmail, value: string) => {
    setDataEditEmail((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <div>
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-30 flex justify-center items-center py-48">
        <div className="w-2/5 bg-white  rounded-2xl p-4">
          <div className="">
            {step === 0 ? (
              <div
                onClick={closeModal}
                className="text-[30px] text-primary w-[50px] h-[50px] flex justify-center items-center rounded-[-50] hover:bg-blue-200 cursor-pointer"
              >
                <IoMdClose />
              </div>
            ) : (
              <div
                onClick={() => {
                  setStep(step - 1);
                }}
                className="text-[30px] text-primary w-[50px] h-[50px] flex justify-center items-center rounded-[-50] hover:bg-blue-200 cursor-pointer"
              >
                <FaArrowLeft />
              </div>
            )}

            <div className="p-4">
              {step === 0 && (
                <div>
                  <InputForm
                    titleHeader={itemsLabelForm[step].title}
                    labelHeader={itemsLabelForm[step].label}
                    labelBtn="Xác nhận OTP"
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
                      text={isCounting ? `Gởi lại ${countdown}` : `Gởi lại`}
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
                    <div>
                      <p className="text-[-14] font-semibold">
                        Email hiện tại:
                      </p>
                      <p className="text-[-14] mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-[-14] font-semibold">Cập nhật email</p>
                      <p className="text-[-14] mt-1">
                        Hãy đảm bảo bạn nhập email chưa được sử dụng. Bạn sẽ sử
                        dụng email mới để đăng nhập vào lần sau.
                      </p>
                    </div>

                    <InputText
                      value={dataEditEmail.email}
                      type="email"
                      label="Email mới"
                      id="email"
                      onChange={(value) =>
                        handleOnChangeDataRegister("email", value)
                      }
                      invalidFields={invalidFields}
                      setInvalidFields={setInvalidFields}
                    />
                    <InputText
                      value={dataEditEmail.confirmEmail}
                      type="confirmEmail"
                      label="Xác nhận lại email"
                      id="confirmEmail"
                      onChange={(value) =>
                        handleOnChangeDataRegister("confirmEmail", value)
                      }
                      invalidFields={invalidFields}
                      setInvalidFields={setInvalidFields}
                    />

                    <div className="mt-5">
                      <ButtonLogin
                        text="Lưu thông tin"
                        onClick={handleSendOTPEmailNew}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <InputForm
                    titleHeader={itemsLabelForm[step].title}
                    labelHeader={itemsLabelForm[step].label}
                    labelBtn="Xác nhận OTP"
                    labelInput="6-digit code"
                    typeInput="text"
                    idInput="otp"
                    value={otpNew}
                    onChange={(value) => setOtpNew(value)}
                    onClick={handleVerifyOtpNew}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                  />

                  <div className="mt-5 relative">
                    <ButtonLogin
                      text={
                        isCounting ? `Gởi lại OTP ${countdown}` : `Gởi lại OTP`
                      }
                      inForm={false}
                      disable={isCounting}
                      onClick={handdleOnSendAgainOTPNew}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center">
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
        </div> */}
      </div>
    </div>
  );
};

export default EditEmail;
