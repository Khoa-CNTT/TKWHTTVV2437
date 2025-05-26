"use client";
import { useEffect, useState } from "react";
import ButtonLogin from "../button/ButtonLogin";
import InputText from "../input/InputText";
import InputForm from "./InputForm";
import validate from "@/utils/validateInput";
import apiUser from "@/api/user";
import { useAuth } from "@/app/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface IInvalidField {
  name: string;
  mes: string;
}

interface IDataRegister {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [dataRegister, setDataRegister] = useState<IDataRegister>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);
  const [isExistEmail, setIsExistEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { setUser } = useAuth();

  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const itemsLabelForm = [
    {
      id: 1,
      title: "Đăng nhập hoặc tạo tài khoản",
      label:
        "Bạn hãy đăng nhập để sử dụng dịch vụ của chúng tôi một cách trọn vẹn.",
    },
    {
      id: 2,
      title: "Hãy xác nhận email của bạn",
      label: `Nhập mã bảo mật mà chúng tôi đã gửi đến ${email} Kiểm tra thư rác nếu không có trong hộp thư đến của bạn.`,
    },
    {
      id: 3,
      title: "Nhập mật khẩu của bạn",
      label: `Email:  ${email}`,
    },
    {
      id: 4,
      title: "Nhập thông tin của bạn",
      label: `Email:  ${email}`,
    },
  ];
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
  const handleSendOtpToEmail = async () => {
    setIsLoading(true);
    const invalids = validate({ email: email }, setInvalidFields);
    if (invalids === 0) {
      const respone = await apiUser.checkMail({ email });
      console.log("respone ", respone);
      if (respone.status === "OK") {
        setIsExistEmail(respone.isExist);
        if (respone.isExist === true) {
          setStep(2);
        } else {
          await handdleOnSendAgainOTP();
          setStep(1);
        }
      } else {
        console.error("Error:", respone.msg);
      }
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    const invalids = validate({ otp: otp }, setInvalidFields);
    if (invalids === 0) {
      try {
        if (isExistEmail) {
          const respone = await apiUser.verifyOTPLogin({
            email: email,
            OTP: otp,
          });

          if (
            respone.status === "OK" &&
            respone.msg === "OTP verified successfully"
          ) {
            handleIsLoginSuccess(respone?.access_token);
          } else {
            Swal.fire("OTP", "OTP sai hoặc đã hết hạn!", "error");
          }
        } else {
          const response = await apiUser.verifyOTP({
            email: email,
            OTP: otp,
          });

          if (
            response.status === "OK" &&
            response.msg === "OTP verified successfully"
          ) {
            setStep(3);
          } else {
            Swal.fire("OTP", "OTP sai hoặc đã hết hạn!", "error");
          }
        }
      } catch (error) {
        console.error("Failed to verify OTP:", error);
        console.log(2); // Lỗi khi gọi API
      }
    }

    setIsLoading(false);
  };

  const handleIsLoginSuccess = async (access_token: string) => {
    setIsLoading(true);
    localStorage.setItem("access_token", access_token);
    const decoded: { id: string } = jwtDecode(access_token);
    const dataUser = await apiUser.getDetailUser(decoded?.id, access_token);

    setUser(dataUser?.data);
    if (dataUser?.data.role === "9") {
      router.push("/admin/dashboard"); // Điều hướng đến trang admin
    } else if (dataUser?.data.role === "7") {
      router.push("/homestay/information");
    } else {
      router.push("/"); // Điều hướng đến trang user
    }
    setIsLoading(false);
  };

  const handleVerifyPassword = async () => {
    setIsLoading(true);
    const invalids = validate({ password: password }, setInvalidFields);
    if (invalids === 0) {
      const respone = await apiUser.verifyPassword({
        email: email,
        password: password,
      });

      if (respone.status === "OK" && respone.msg === "SUCCESS") {
        handleIsLoginSuccess(respone?.access_token);
        // Swal.fire("Đăng nhập", "Đăng nhập tài khoản thành công!", "success");
      } else {
        Swal.fire("Mật khẩu", "Mật khẩu không đúng?", "error");
      }
    }
    setIsLoading(false);
  };

  const handleUsePassword = () => {
    setStep(2);
  };

  const handleUseOtp = async () => {
    await handdleOnSendAgainOTP();
    setStep(1);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    const invalids = validate({ ...dataRegister }, setInvalidFields);
    if (invalids === 0) {
      console.log("data ", dataRegister);

      const respone = await apiUser.resgister({
        email: email,
        firstName: dataRegister.firstName,
        lastName: dataRegister.lastName,
        phone: dataRegister.phone,
        password: dataRegister.password,
      });

      if (respone.status === "OK" && respone.msg === "Register is success") {
        handleIsLoginSuccess(respone.access_token);
        // Swal.fire("Đăng ký", "Đăng ký tài khoản thành công!", "success");
      } else {
        Swal.fire(
          "Số điện thoại",
          "Số điện thoại này đã được sử dụng!",
          "error"
        );
      }
    }
    setIsLoading(false);
  };

  const handdleOnSendAgainOTP = async () => {
    setIsLoading(true);
    const respone = await apiUser.sendOtpToEmail({ email });

    setIsCounting(true);
    setIsLoading(false);
    setCountdown(30);
  };

  const handleOnChangeDataRegister = (
    key: keyof IDataRegister,
    value: string
  ) => {
    setDataRegister((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-white flex justify-center items-center z-50">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
      {step === 0 && (
        <>
          <InputForm
            titleHeader={itemsLabelForm[step].title}
            labelHeader={itemsLabelForm[step].label}
            labelBtn="Tiếp tục"
            labelInput="Email"
            typeInput="email"
            idInput="email"
            value={email}
            onChange={(value) => setEmail(value)}
            onClick={handleSendOtpToEmail}
            disabled={email === "" && true}
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
        </>
      )}

      {step === 1 && (
        <div>
          <InputForm
            titleHeader={itemsLabelForm[step].title}
            labelHeader={itemsLabelForm[step].label}
            labelBtn="Xác thực OTP"
            labelInput="6 chữ số"
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
              text={isCounting ? `Gởi lại OTP ${countdown}` : `Gởi lại`}
              inForm={false}
              disable={isCounting}
              onClick={handdleOnSendAgainOTP}
            />
          </div>
          {isExistEmail && (
            <div className="mt-5">
              <ButtonLogin
                text="Sử dụng mật khẩu"
                inForm={false}
                onClick={handleUsePassword}
              />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <>
          <InputForm
            titleHeader={itemsLabelForm[step].title}
            labelHeader={itemsLabelForm[step].label}
            labelBtn="Đăng nhập"
            labelInput="Mật khẩu"
            typeInput="password"
            idInput="password"
            value={password}
            onChange={(value) => [setPassword(value)]}
            onClick={handleVerifyPassword}
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="mt-5">
            <ButtonLogin
              text={
                isCounting ? `Sử dụng mã OTP ${countdown}` : `Sử dụng mã OTP`
              }
              inForm={false}
              onClick={handleUseOtp}
              disable={isCounting}
            />
          </div>
        </>
      )}

      {step === 3 && (
        <div>
          <h1 className="text-2xl font-semibold py-6">
            {itemsLabelForm[step].title}
          </h1>
          <p className="text-sm mb-6">{itemsLabelForm[step].label}</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <InputText
                value={dataRegister.firstName}
                type="text"
                label="Tên"
                id="firstName"
                onChange={(value) =>
                  handleOnChangeDataRegister("firstName", value)
                }
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />

              <InputText
                value={dataRegister.lastName}
                type="text"
                label="Họ"
                id="lastName"
                onChange={(value) =>
                  handleOnChangeDataRegister("lastName", value)
                }
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
            </div>

            <InputText
              value={dataRegister.phone}
              type="text"
              label="Số điện thoại"
              id="phone"
              onChange={(value) => handleOnChangeDataRegister("phone", value)}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />

            <InputText
              value={dataRegister.password}
              type="password"
              label="Mật khẩu"
              id="password"
              onChange={(value) =>
                handleOnChangeDataRegister("password", value)
              }
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
            <InputText
              value={dataRegister.confirmPassword}
              type="password"
              label="Xác nhận mật khẩu"
              id="confirmPassword"
              onChange={(value) =>
                handleOnChangeDataRegister("confirmPassword", value)
              }
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />

            <div className="mt-5">
              <ButtonLogin text="Tiếp tục" onClick={handleRegister} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
