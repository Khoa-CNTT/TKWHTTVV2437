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
  const { user } = useAuth();
  const { setUser } = useAuth();

  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const itemsLabelForm = [
    {
      id: 1,
      title: "Đăng nhập hoặc tạo tài khoản",
      label:
        "Bạn có thể đăng nhập tài khoản Booking.com của mình để truy cập các dịch vụ của chúng tôi.",
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
    const invalids = validate({ email: email }, setInvalidFields);
    if (invalids === 0) {
      const respone = await apiUser.sendOtpToEmail({ email });
      console.log("respone ", respone);
      if (respone.status === "OK") {
        setIsExistEmail(respone.isExist);
        console.log("OTP sent successfully:", respone.msg);
        setIsCounting(true);
        setCountdown(30);
        setStep(1);
      } else {
        console.error("Error:", respone.msg);
      }
    }
  };

  const handleVerifyOtp = async () => {
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
            console.log("OTP sai"); // OTP sai
          }
        }
      } catch (error) {
        console.error("Failed to verify OTP:", error);
        console.log(2); // Lỗi khi gọi API
      }
    }
  };

  const handleIsLoginSuccess = async (access_token: string) => {
    localStorage.setItem("access_token", access_token);
    const decoded: { id: string } = jwtDecode(access_token);
    const dataUser = await apiUser.getDetailUser(decoded?.id, access_token);
    setUser(dataUser.data);
    router.push("/");
  };

  const handleVerifyPassword = async () => {
    const invalids = validate({ password: password }, setInvalidFields);
    if (invalids === 0) {
      const respone = await apiUser.verifyPassword({
        email: email,
        password: password,
      });

      if (respone.status === "OK" && respone.msg === "SUCCESS") {
        handleIsLoginSuccess(respone?.access_token);
      } else {
        console.log("2 Mật khẩu sai"); // Mật khẩu sai
      }
    }
  };

  const handleUsePassword = () => {
    setStep(2);
  };

  const handleUseOtp = () => {
    setStep(1);
  };

  const handleRegister = async () => {
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
      }
    }
  };

  const handdleOnSendAgainOTP = async () => {
    const respone = await apiUser.sendOtpToEmail({ email });

    setIsCounting(true);
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
      {step === 0 && (
        <>
          <InputForm
            titleHeader={itemsLabelForm[step].title}
            labelHeader={itemsLabelForm[step].label}
            labelBtn="Countinue"
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
                isCounting ? `Send again OTP ${countdown}` : `Send again OTP`
              }
              inForm={false}
              disable={isCounting}
              onClick={handdleOnSendAgainOTP}
            />
          </div>
          {isExistEmail && (
            <div className="mt-5">
              <ButtonLogin
                text="Use my password"
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
            labelBtn="Sign in"
            labelInput="Password"
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
              text="Enter secure code instead"
              inForm={false}
              onClick={handleUseOtp}
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
                label="First Name"
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
                label="Last Name"
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
              label="Phone"
              id="phone"
              onChange={(value) => handleOnChangeDataRegister("phone", value)}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />

            <InputText
              value={dataRegister.password}
              type="password"
              label="Password"
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
              label="Confirm Password"
              id="confirmPassword"
              onChange={(value) =>
                handleOnChangeDataRegister("confirmPassword", value)
              }
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />

            <div className="mt-5">
              <ButtonLogin text="Countinue" onClick={handleRegister} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
