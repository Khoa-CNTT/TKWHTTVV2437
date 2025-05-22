"use client";
import { FaRegTrashCan } from "react-icons/fa6";
import InputText from "../input/InputText";
import { useEffect, useRef, useState } from "react";
import apiPayment from "@/api/payment";
import ButtonLogin from "../button/ButtonLogin";
import { useAuth } from "@/app/contexts/AuthContext";
import apiRegisterPartner from "@/api/registerPartner";
import validate from "@/utils/validateInput";
import Swal from "sweetalert2";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";
import { MdMapsHomeWork } from "react-icons/md";
import { useRouter } from "next/navigation";
import LoadingEdit from "../loading/LoadingEdit";
import LoadingItem from "../loading/LoadingItem";

interface IData {
  name: string;
  numberCCCD: string;
  afterImage: string;
  beforeImage: string;
  status: string;
}

interface IInvalidField {
  name: string;
  mes: string;
}

const RegisterPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<IData>({
    name: "",
    numberCCCD: "",
    beforeImage: "",
    afterImage: "",
    status: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [disable, setDisable] = useState(false);
  const [action, setAction] = useState(false);

  const [invalidFields, setInvalidFields] = useState<IInvalidField[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isLoadingBefor, setIsloadingBefore] = useState<boolean>(false);
  const [isLoadingAfter, setIsloadingAfter] = useState<boolean>(false);
  const [isLoadingItem, setIsloadingItem] = useState<boolean>(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const handleGetDetailRegisterPartner = async () => {
    if (user) {
      setIsloadingItem(true);
      const res = await apiRegisterPartner.getDetailRegisterPartner(user.id);
      console.log("123", res);
      if (res?.status === "OK" && res?.data !== null) {
        setData({
          name: res?.data?.name,
          numberCCCD: res?.data?.numberCCCD,
          afterImage: res?.data?.afterImage,
          beforeImage: res?.data?.beforeImage,
          status: res?.data?.status,
        });
        setDisable(true);
      } else {
        setData({
          name: "",
          numberCCCD: "",
          afterImage: "",
          beforeImage: "",
          status: "",
        });
        setDisable(false);
      }
      setIsloadingItem(false);
    }
  };
  useEffect(() => {
    handleGetDetailRegisterPartner();
  }, [user, action]);

  const handleFileChangeBefore = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsloadingBefore(true);
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploadVideo");
      const res = await apiPayment.uploadImageToCloud(formData);
      setData((prev) => ({
        ...prev,
        beforeImage: res?.data?.secure_url || "",
      }));
    }
    setIsloadingBefore(false);
  };

  const handleFileChangeAfter = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsloadingAfter(true);
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploadVideo");
      const res = await apiPayment.uploadImageToCloud(formData);
      setData((prev) => ({
        ...prev,
        afterImage: res?.data?.secure_url || "",
      }));
    }
    setIsloadingAfter(false);
  };

  const handleFileRemoveBefore = () => {
    setData((prev) => ({
      ...prev,
      beforeImage: "",
    }));
    if (beforeRef?.current) {
      beforeRef.current.value = "";
    }
  };
  const handleFileRemoveAfter = () => {
    setData((prev) => ({
      ...prev,
      afterImage: "",
    }));
    if (afterRef?.current) {
      afterRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const invalids = validate(
      {
        name: data.name,
        numberCCCD: data.numberCCCD,
        beforeImage: data.afterImage,
        afterImage: data.afterImage,
      },
      setInvalidFields
    );
    console.log(invalids);
    if (invalids === 0 && user) {
      setIsloading(true);
      const res = await apiRegisterPartner.resgister({
        ...data,
        idUser: user.id,
      });
      if (res.status === "OK") {
        setAction(!action);
        setInvalidFields([]);
      } else {
        Swal.fire(
          "Thất bại",
          "Đăng ký thông tin thất bại hãy thử lại!",
          "error"
        );
      }
      setIsloading(false);
    }
  };

  const handleCancel = async () => {
    if (user) {
      setIsloading(true);
      const res = await apiRegisterPartner.cancel(user.id);
      if (res?.status === "OK") {
        Swal.fire({
          title: "Đã hủy yêu cầu!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setAction(!action);
      }
      setIsloading(false);
    }
  };
  const navigateDashboard = () => {
    router.push("/admin/dashboard");
  };
  return (
    <div>
      {isLoading && <LoadingEdit />}
      <div className="w-3/4 mx-auto">
        {isLoadingItem && (
          <div className="flex justify-center">
            <LoadingItem />
          </div>
        )}
        {data?.status === "confirmed" ? (
          <div className="flex flex-col items-center justify-center my-20">
            <div className="text-2xl font-semibold ">
              Chúc mừng bạn đã trờ thành người đồng hành với chúng tôi!
            </div>
            {/* <span className="text-[170px] text-green-400 my-10">
              <BsCheckCircleFill />
            </span> */}
            <button
              className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-full shadow-md active:scale-95 transition-transform duration-100 my-10"
              onClick={navigateDashboard}
            >
              Trang quản lí của bạn
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 12l19-9-4 9 4 9z" />
              </svg> */}
              <span className="h-4 w-4 ml-2">
                <MdMapsHomeWork />
              </span>
            </button>
          </div>
        ) : (
          <div className="py-10 mx-auto">
            {data?.status === "rejected" && (
              <div className="flex justify-center mb-4">
                <div className="py-2 px-4 border border-red-500 bg-yellow-50 text-red-500  w-[300px] flex justify-center rounded-xl">
                  Yêu cầu của bạn đã bị từ chối
                </div>
              </div>
            )}

            <h1 className="text-2xl font-semibold flex justify-center">
              Đăng ký trở thành người kinh doanh
            </h1>

            <div className="mt-10  w-[500px] mx-auto flex flex-col gap-8">
              {disable && (
                <div className="flex items-center justify-end">
                  {/* <button className="text-[-14] text-primary hover:underline cursor-pointer font-semibold">
                  Chỉnh sửa thông tin ?
                </button> */}
                  <button
                    className="text-[-14] text-primary hover:underline cursor-pointer font-semibold"
                    onClick={handleCancel}
                  >
                    Hủy yêu cầu
                  </button>
                </div>
              )}
              <InputText
                disable={disable}
                value={data.name}
                label="Nhập họ và tên"
                id="name"
                type="text"
                onChange={(value) =>
                  setData((prev) => ({ ...prev, name: value }))
                }
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <InputText
                disable={disable}
                value={data.numberCCCD}
                label="Nhập số căn cước công dân"
                id="numberCCCD"
                type="text"
                onChange={(value) =>
                  setData((prev) => ({ ...prev, numberCCCD: value }))
                }
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
              />
              <div>
                <div className="flex flex-col gap-3">
                  <p className="mt-1 font-semibold text-[-14]">
                    Update mặt trước căn cước công dân:{" "}
                  </p>
                  <label
                    htmlFor="file-upload1"
                    className="px-4 py-2 w-[150px] font-bold bg-black text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
                  >
                    📁 Chọn ảnh
                  </label>
                  {invalidFields?.some((el) => el.name === "beforeImage") && (
                    <p className="mt-0.5 text-[-12] text-red-600 italic">
                      {
                        invalidFields.find((el) => el.name === "beforeImage")
                          ?.mes
                      }
                    </p>
                  )}

                  <input
                    ref={beforeRef}
                    disabled={disable === true ? true : false}
                    id="file-upload1"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleFileChangeBefore(e);
                    }}
                  />
                  {isLoadingBefor && (
                    <div className="flex items-center justify-center w-[200px] h-[200px]">
                      <LoadingItem />
                    </div>
                  )}
                  {data.beforeImage && (
                    <div className="relative w-fit">
                      <img
                        src={data.beforeImage}
                        alt="Xem trước"
                        className="w-[200px] object-cover rounded-lg border shadow"
                      />
                      <div
                        className="absolute top-2 right-2 px-2 py-2 rounded-[-50] bg-gray-300 hover:opacity-25 cursor-pointer"
                        onClick={() => {
                          if (disable === false) {
                            handleFileRemoveBefore();
                          }
                        }}
                      >
                        <FaRegTrashCan />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-3">
                  <p className="mt-1 font-semibold text-[-14]">
                    Update mặt sau căn cước công dân:{" "}
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 w-[150px] font-bold bg-black text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition"
                  >
                    📁 Chọn ảnh
                  </label>
                  {invalidFields?.some((el) => el.name === "afterImage") && (
                    <p className="mt-0.5 text-[-12] text-red-600 italic">
                      {
                        invalidFields.find((el) => el.name === "afterImage")
                          ?.mes
                      }
                    </p>
                  )}

                  <input
                    ref={afterRef}
                    disabled={disable === true ? true : false}
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleFileChangeAfter(e);
                    }}
                  />

                  {isLoadingAfter && (
                    <div className="flex items-center justify-center w-[200px] h-[200px]">
                      <LoadingItem />
                    </div>
                  )}
                  {data.afterImage && (
                    <div className="relative w-fit">
                      <img
                        src={data.afterImage}
                        alt="Xem trước"
                        className="w-[200px] object-cover rounded-lg border shadow"
                      />
                      <div
                        className="absolute top-2 right-2 px-2 py-2 rounded-[-50] bg-gray-300 hover:opacity-25 cursor-pointer"
                        onClick={() => {
                          if (disable === false) {
                            handleFileRemoveAfter();
                          }
                        }}
                      >
                        <FaRegTrashCan />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={disable || agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  Tôi đã đọc và đồng ý với{" "}
                  <a
                    href="/terms/host-agreement"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Điều khoản dành cho chủ homestay
                  </a>
                </span>
              </label>
              {disable === false ? (
                <button
                  disabled={!agreed}
                  onClick={handleSubmit}
                  // onClick={() => {
                  //   console.log("123");
                  // }}
                  className={`py-3 rounded-xl  text-white font-semibold  text-[-14] ${!agreed ? "w-full    font-semibold  bg-blue-300 text-white  cursor-not-allowed" : "bg-primary"}`}
                >
                  Gởi yêu cầu
                </button>
              ) : (
                <button
                  disabled={!agreed}
                  onClick={handleSubmit}
                  className={`py-3 rounded-xl  text-white font-semibold  text-[-14]  bg-blue-300 `}
                >
                  Đang chờ phê duyệt ...
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
