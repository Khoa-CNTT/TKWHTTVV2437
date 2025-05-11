"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { IImage } from "@/app/types/property";
import { v4 as uuidv4 } from "uuid";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IRoomCreate } from "@/app/types/room";
import { VscSaveAs } from "react-icons/vsc";
import { useRouter } from "next/navigation";

import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import apisImage from "@/apis/image";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { ISummary } from "@/app/types/summary";
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";

// import icon summary
import { LuSalad } from "react-icons/lu";
import { MdMoneyOff } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { SlEnergy } from "react-icons/sl";
import { FaCheckCircle } from "react-icons/fa";

// import icon
import { FaSwimmer } from "react-icons/fa";
import { TbSmokingNo } from "react-icons/tb";
import { FaWifi } from "react-icons/fa";
import { LuCircleParking } from "react-icons/lu";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { TbBus } from "react-icons/tb";
import { MdFamilyRestroom } from "react-icons/md";
import { IAmenity } from "@/app/types/amenity";
import FormControlLabel from "@mui/material/FormControlLabel";
import apisAmenity from "@/apis/amenity";
import apisSummary from "@/apis/summary";
import apisRoom from "@/apis/room";
import { toast } from "react-toastify";
import { useAuth } from "@/app/contexts/AuthContext";
import apisProperty from "@/apis/property";

// set icon map
const iconMap: { [key: string]: JSX.Element } = {
  FaSwimmer: <FaSwimmer />,
  TbSmokingNo: <TbSmokingNo />,
  FaWifi: <FaWifi />,
  LuCircleParking: <LuCircleParking />,
  FaUmbrellaBeach: <FaUmbrellaBeach />,
  MdRestaurant: <MdRestaurant />,
  TbBus: <TbBus />,
  MdFamilyRestroom: <MdFamilyRestroom />,
};

// set icon sumary
const iconSumary: { [key: string]: JSX.Element } = {
  LuSalad: <LuSalad />,
  MdMoneyOff: <MdMoneyOff />,
  FaRegCreditCard: <FaRegCreditCard />,
  SlEnergy: <SlEnergy />,
  FaCheckCircle: <FaCheckCircle />,
};

const listStatus = [
  {
    key: "0",
    value: "Chọn trạng thái",
  },
  {
    key: "active",
    value: "Đang hoạt động",
  },
  {
    key: "inactive",
    value: "Không hoạt động",
  },
];

interface IProps {
  id: string;
}

const InformationRoom: React.FC<IProps> = ({ id }) => {
  const [initialData, setInitialData] = useState({
    name: "",
    maxPerson: 1,
    price: "",
    status: "0",
    code: "",
    quantity: 1,
  });
  const [initialAmenities, setInitialAmenities] = useState<string[]>([]);
  const [initialSummaries, setInitialSummaries] = useState<string[]>([]);
  const [initialImages, setInitialImages] = useState<IImage[]>([]);

  const [spinner, setSpinner] = useState<boolean>(false);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<IImage[]>([]);
  const [showTrash, setShowTrash] = useState<string>("");
  const [data, setData] = useState<{
    name?: string;
    maxPerson: number;
    price?: string;
    status?: string;
    code?: string;
    quantity: number;
  }>({
    name: "",
    maxPerson: 1,
    price: "",
    status: "0",
    code: "",
    quantity: 1,
  });
  const [amenities, setAmenities] = useState<IAmenity[]>([]);
  const [summaries, setSummaries] = useState<ISummary[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSummaries, setSelectedSummaries] = useState<string[]>([]);
  const { user } = useAuth();
  const [propertyId, setProportyId] = useState<string>("");
  const [check, setCheck] = useState<boolean>(false);

  useEffect(() => {
    const fetchPropertyId = async (id: string) => {
      const response = await apisProperty.getPropertyIdByUserId(id);

      if (response?.data) {
        setProportyId(response.data.id);
      }
    };

    if (user?.id) {
      fetchPropertyId(user?.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchDataAmenities = async () => {
      const response = await apisAmenity.getAllList();

      if (response?.data) {
        setAmenities(response.data);
      }
    };
    const fetchDataSummaries = async () => {
      const response = await apisSummary.getAllList();

      if (response?.data) {
        setSummaries(response.data);
      }
    };

    fetchDataAmenities();
    fetchDataSummaries();
  }, []);

  useEffect(() => {
    const fetchDataRoom = async () => {
      const response = await apisRoom.getDetailById(id);

      if (response.data) {
        const roomData = {
          name: response.data.name,
          maxPerson: response.data.maxPerson,
          price: response.data.price,
          status: response.data.status,
          code: response.data.code,
          quantity: response.data.quantity,
        };

        setData(roomData);
        setInitialData(roomData);

        const amenities = response.data.amenities.map(
          (item: { id: string }) => item.id
        );
        setSelectedAmenities(amenities);
        setInitialAmenities(amenities);

        const summaries = response.data.summaries.map(
          (item: { id: string }) => item.id
        );
        setSelectedSummaries(summaries);
        setInitialSummaries(summaries);

        const images = response.data.images.map(
          (item: { id: string; image: string }) => ({
            id: item.id,
            image: item.image,
          })
        );
        setSelectedImage(images);
        setInitialImages(images);
      }
    };

    fetchDataRoom();
  }, [id, check]);

  const handleRemoveImage = (id: string) => {
    setSelectedImage((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        formData.append("images", file);
      });

      const uploadImage = async () => {
        const response = await apisImage.uploadImageMutiple(formData);

        if (response.files) {
          const newImages = response.files.map((item: { url: string }) => ({
            id: uuidv4(),
            image: item.url,
          }));
          setSelectedImage((prev) => [...prev, ...newImages]);
        }
      };

      uploadImage();
    }
  };

  // function handle
  const handleCheckboxChange = (id: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(id)) {
        // Nếu đã chọn, loại bỏ khỏi danh sách
        return prev.filter((amenityId) => amenityId !== id);
      } else {
        // Nếu chưa chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  // function onchage checkbox summary
  const handleCheckboxChangeSummary = (id: string) => {
    setSelectedSummaries((prev) => {
      if (prev.includes(id)) {
        // Nếu đã chọn, loại bỏ khỏi danh sách
        return prev.filter((summaryId) => summaryId !== id);
      } else {
        // Nếu chưa chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const isFormValid = () => {
    return (
      data.name?.trim() !== "" &&
      data.price?.toString()?.trim() !== "" &&
      data.status !== "0" &&
      data.code?.trim() !== "" &&
      data?.maxPerson > 0 &&
      data?.quantity > 0 &&
      selectedAmenities.length > 0 &&
      selectedSummaries.length > 0 &&
      selectedImage.length > 0
    );
  };

  const hasChanges = () => {
    return (
      JSON.stringify(data) !== JSON.stringify(initialData) ||
      JSON.stringify(selectedAmenities) !== JSON.stringify(initialAmenities) ||
      JSON.stringify(selectedSummaries) !== JSON.stringify(initialSummaries) ||
      JSON.stringify(selectedImage) !== JSON.stringify(initialImages)
    );
  };

  const handleSubmit = () => {
    let dataSubmit: IRoomCreate = {};
    dataSubmit.images = selectedImage;
    dataSubmit.amenities = selectedAmenities;
    dataSubmit.summaries = selectedSummaries;

    dataSubmit = { ...dataSubmit, ...data };

    if (id) {
      const handleUpdateData = async () => {
        try {
          setSpinner(true);
          const response = await apisRoom.updateRoom(id, dataSubmit);

          if (response?.status === "OK") {
            toast.success("Cập nhật thông tin thành công!");
            setSpinner(false);
            router.push("/homestay/manager-room");
          } else {
            toast.error("Cập nhật thông tin thất bại!");
            setCheck((prev) => !prev);
          }
        } catch (error) {
          console.error("Error updating property:", error);
          toast.error("Đã xảy ra lỗi khi cập nhật thông tin!");
          setCheck((prev) => !prev);
          setSpinner(false);
        }
      };
      handleUpdateData();
    } else {
      const handleCreateData = async () => {
        try {
          dataSubmit.propertyId = propertyId;

          setSpinner(true);
          const response = await apisRoom.createRoom(dataSubmit);

          if (response?.status === "OK") {
            toast.success("Tạo thông tin thành công!");
            setSpinner(false);
            router.push("/homestay/manager-room");
          } else {
            toast.error("Cập nhật thông tin thất bại!");
            setSpinner(false);
          }
        } catch (error) {
          console.error("Error updating property:", error);
          toast.error("Đã xảy ra lỗi khi tạo thông tin!");
        }
      };

      handleCreateData();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Thông tin phòng</h1>

      <h3 className="mt-8 text-md font-semibold">Thông tin ảnh</h3>

      <div className="grid grid-cols-6 gap-2 mt-2">
        {selectedImage?.map((item: { image: string; id: string }) => (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => setShowTrash(item.id)}
            onMouseLeave={() => setShowTrash("")}
          >
            <img
              alt="image"
              className="h-[160px] w-full rounded-md object-cover"
              src={item.image}
            ></img>

            {showTrash === item.id && (
              <button
                onClick={() => handleRemoveImage(item.id)}
                className="absolute top-[10px] right-[10px]"
              >
                <MdDeleteForever className="text-red-500" size={24} />
              </button>
            )}
          </div>
        ))}

        <label
          htmlFor="file-input"
          className="border-[2px] border-blue-700 flex items-center justify-center border-dashed cursor-pointer h-[160px]"
        >
          <div>
            <div className="flex justify-center pb-3">
              <FaPlus size={22} className="text-blue-700" />
            </div>
            <span className="font-semibold">Chọn thêm ảnh</span>
          </div>
        </label>
        <input
          id="file-input"
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </div>

      <h4 className="mt-8 text-2xl font-semibold">Thông tin chi tiết phòng</h4>

      <div className="mt-4 flex items-center gap-8">
        <div className="flex flex-col gap-2 w-[70%]">
          <label className="font-semibold text-md">Tên phòng</label>
          <TextField
            value={data?.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px", // Padding cho nội dung input
              },
            }}
            id="outlined-basic"
            variant="outlined"
          />
        </div>

        <div className="flex flex-col gap-2 w-[20%]">
          <label className="font-semibold text-md">Mã phòng</label>
          <TextField
            value={data?.code}
            onChange={(e) => setData({ ...data, code: e.target.value })}
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px", // Padding cho nội dung input
              },
            }}
            id="outlined-basic"
            variant="outlined"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-md">Giá / 1 đêm (VND)</label>

          <OutlinedInput
            value={data.price}
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) {
                return;
              }

              setData((prev) => ({ ...prev, price: e.target.value }));
            }}
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px", // Padding cho nội dung input
              },
            }}
          />
        </div>

        <div className="w-[15%] flex flex-col gap-2">
          <label className="font-semibold text-md">Trạng thái</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={data.status || "0"} // Giá trị mặc định từ state
              onChange={(e) => setData({ ...data, status: e.target.value })}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              {listStatus.map((item: { key: string; value: string }) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-md">Sức chứa/ người</label>
          <div className="flex text-sm items-center gap-4 h-[43px] border px-6 rounded-md border-gray-300">
            <LuMinus
              onClick={() => {
                if (data.maxPerson === 1) {
                  return;
                } else {
                  setData((prev) => ({
                    ...prev,
                    maxPerson: prev.maxPerson - 1,
                  }));
                }
              }}
              size={25}
              className="text-gray-600 cursor-pointer"
            />
            <p className="w-[50px] font-semibold no-selecter text-center">
              {data.maxPerson}
            </p>
            <LuPlus
              onClick={() =>
                setData((prev) => ({ ...prev, maxPerson: prev.maxPerson + 1 }))
              }
              size={22}
              className="text-gray-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-md">Số lượng phòng</label>
          <div className="flex text-sm items-center gap-4 h-[43px] border px-6 rounded-md border-gray-300">
            <LuMinus
              onClick={() => {
                if (data.quantity === 1) {
                  return;
                } else {
                  setData((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
                }
              }}
              size={22}
              className="text-gray-600 cursor-pointer"
            />
            <p className="w-[70px] font-semibold no-selecter text-center">
              {data.quantity}
            </p>
            <LuPlus
              onClick={() =>
                setData((prev) => ({ ...prev, quantity: prev.quantity + 1 }))
              }
              size={22}
              className="text-gray-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label className="font-semibold text-md">Thông tin các tiện ích</label>

        <div className="grid grid-cols-6 gap-4">
          {amenities.map((item: IAmenity) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={selectedAmenities.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                ></Checkbox>
              }
              label={
                <div className="text-green-700 flex items-center gap-2 text-sm font-medium">
                  <div className="text-xl">{iconMap[item.icon]}</div>
                  <span>{item.name}</span>
                </div>
              }
            />
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <label className="font-semibold text-md">Thông tin tóm tắt</label>

          <div className="grid grid-cols-6 gap-4">
            {summaries.map((item: ISummary) => (
              <FormControlLabel
                key={item.id}
                control={
                  <Checkbox
                    checked={selectedSummaries.includes(item.id)}
                    onChange={() => handleCheckboxChangeSummary(item.id)}
                  ></Checkbox>
                }
                label={
                  <div className="text-green-700 flex items-center gap-2 text-sm font-medium">
                    <div className="text-xl">{iconSumary[item.icon]}</div>
                    <span>{item.name}</span>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={id ? !hasChanges() && !isFormValid() : !isFormValid()} // Vô hiệu hóa nút nếu form không hợp lệ
          className={`flex items-center gap-2 py-3 px-8 text-white rounded-md font-semibold transition-300 ${
            id
              ? hasChanges() && isFormValid()
                ? "bg-green-700 hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
              : isFormValid()
                ? "bg-green-700 hover:opacity-90"
                : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {spinner && (
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          )}
          <VscSaveAs size={20} />
          <span>{id ? "Cập nhật thông tin phòng" : "Tạo loại phòng"}</span>
        </button>
      </div>
    </div>
  );
};

export default InformationRoom;
