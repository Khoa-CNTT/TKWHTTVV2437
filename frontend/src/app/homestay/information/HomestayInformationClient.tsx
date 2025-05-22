"use client";

import React, { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaParking } from "react-icons/fa";
import apisAmenity from "@/apis/amenity";
import { IAmenity } from "@/app/types/amenity";
import { v4 as uuidv4 } from "uuid";
import { VscSaveAs } from "react-icons/vsc";
import { IPropertyCreate } from "@/app/types/property";
import { toast } from "react-toastify";

// import icon
import { FaSwimmer } from "react-icons/fa";
import { TbSmokingNo } from "react-icons/tb";
import { FaWifi } from "react-icons/fa";
import { LuCircleParking } from "react-icons/lu";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { TbBus } from "react-icons/tb";
import { MdFamilyRestroom } from "react-icons/md";
import apisProperty from "@/apis/property";
import apisHighlight from "@/apis/highlight";
import { IHightlight } from "@/app/types/highlight";
import { MdDeleteForever } from "react-icons/md";
import { MdTableBar } from "react-icons/md";
import { FaSpa } from "react-icons/fa";
import { GiMagicBroom } from "react-icons/gi";

// import icon highlight
import { IoIosHeartEmpty } from "react-icons/io";
import { SlPicture } from "react-icons/sl";
import { FaBusAlt } from "react-icons/fa";
import { IImage, IProperty } from "@/app/types/property";
import apisCategory from "@/apis/category";
import apisAddress from "@/apis/address";
import apisImage from "@/apis/image";
import { useAuth } from "@/app/contexts/AuthContext";
import { FaKitchenSet } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";

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
  MdTableBar: <MdTableBar />,
  FaSpa: <FaSpa />,
  GiMagicBroom: <GiMagicBroom />,
};

// set icon map highlight
const iconMapHighlight: { [key: string]: JSX.Element } = {
  FaParking: <FaParking size={30} />,
  IoIosHeartEmpty: <IoIosHeartEmpty size={30} />,
  SlPicture: <SlPicture size={30} />,
  FaBusAlt: <FaBusAlt size={30} />,
  FaKitchenSet: <FaKitchenSet size={30} />,
  IoFastFoodOutline: <IoFastFoodOutline size={30} />,
};

// interface data
interface IData {
  name: string;
  categoryId: string;
  country: string;
  city: string;
  district: string;
  street: string;
  description: string;
  selectedAmenities?: string[];
  id: string;
}

const HomestayInformationClient = () => {
  const [initialData, setInitialData] = useState<IData | null>(null);
  const [initialAmenities, setInitialAmenities] = useState<string[]>([]);
  const [initialHighLight, setInitialHighLight] = useState<string[]>([]);
  const [initialImage, setInitialImage] = useState<IImage[]>([]);
  const [check, setCheck] = useState<boolean>(false);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [propertyId, setPropertyId] = useState<string>("");

  const [cities, setCities] = useState<{ name: string; code: string }[]>([]);
  const [districts, setDistricts] = useState<{ name: string; code: string }[]>(
    []
  );
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState<IAmenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [highlights, setHighLights] = useState<IHightlight[]>([]);
  const [selectedHighLight, setSelectedHighLight] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<IImage[]>([]);
  const [provinceCode, setProvinceCode] = useState<string>("");
  const [showTrash, setShowTrash] = useState<string>("");
  const [data, setData] = useState<IData>({
    id: "",
    name: "",
    categoryId: "",
    country: "",
    city: "",
    district: "",
    street: "",
    description: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchPropertyId = async (id: string) => {
      const response = await apisProperty.getPropertyIdByUserId(id);

      if (response?.data) {
        setPropertyId(response?.data?.id);
      }
    };
    if (user?.id) {
      fetchPropertyId(user?.id);
    }
  }, [user?.id, check]);

  useEffect(() => {
    const fetchDataAmenities = async () => {
      const response = await apisAmenity.getAllList();

      if (response?.data) {
        setAmenities(response?.data);
      }
    };

    const fetchDataHighLight = async () => {
      const response = await apisHighlight.getListAll();

      if (response?.data) {
        setHighLights(response?.data);
      }
    };

    const fetchDataCategories = async () => {
      const response = await apisCategory.getAllList();
      if (response?.data) {
        setCategories(response?.data);
      }
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchDataAmenities(),
          fetchDataHighLight(),
          fetchDataCategories(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchDataCities = async () => {
      const response = await apisAddress.getListProvince();
      if (response?.data) {
        setCities(
          response?.data?.data?.map((item: { name: string; code: string }) => ({
            name: item?.name,
            code: item?.code,
          }))
        );
      }
    };

    if (data?.country === "0") {
      setCities([]);
    }

    if (data?.country && data?.country !== "0") {
      fetchDataCities();
    }
  }, [data?.country]);

  useEffect(() => {
    const fetchDataProperty = async () => {
      const response = await apisProperty.getPropertyByUserId(user?.id);
      if (response?.data) {
        const propertyData = {
          name: response.data?.name,
          categoryId: response.data?.idCategory,
          country: response.data?.propertyAddress?.country,
          city: response.data?.propertyAddress?.city,
          district: response.data?.propertyAddress?.district,
          street: response.data?.propertyAddress?.street,
          description: response.data?.description,
          id: response?.data?.id,
        };
        setData(propertyData);
        setInitialData(propertyData);

        const amenities = response?.data?.amenities?.map(
          (item: IAmenity) => item.id
        );
        setSelectedAmenities(amenities);
        setInitialAmenities(amenities);

        const highlights = response?.data?.highlights?.map(
          (item: IHightlight) => item.id
        );
        setSelectedHighLight(highlights);
        setInitialHighLight(highlights);

        const images = response?.data?.images?.map((item: IImage) => ({
          image: item?.image,
          id: item.id,
        }));
        setSelectedImage(images);
        setInitialImage(images);
      }
    };

    fetchDataProperty();
  }, [propertyId, check]);

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

  // get province code when select city
  useEffect(() => {
    const selectedCity = cities?.find((city) => city?.name === data?.city);
    if (selectedCity && data?.city !== "0") {
      setProvinceCode(selectedCity?.code); // Lưu `code` vào state
    }

    if (data?.city === "0") {
      setDistricts([]);
    }
  }, [data?.city, cities]);

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await apisAddress.getListDistrict(provinceCode);
      if (response?.data) {
        setDistricts(
          response?.data?.data?.map((item: { name: string; code: string }) => ({
            name: item?.name,
            code: item?.code,
          }))
        );
      }
    };

    fetchDistricts();
  }, [provinceCode]);

  // handle checkbox highlight
  const handleCheckboxChangeHighlight = (id: string) => {
    setSelectedHighLight((prev) => {
      if (prev.includes(id)) {
        // Nếu đã chọn, loại bỏ khỏi danh sách
        return prev?.filter((highlightId) => highlightId !== id);
      } else {
        // Nếu chưa chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const formData = new FormData();
      Array.from(e?.target?.files).forEach((file) => {
        formData.append("images", file);
      });

      const uploadImage = async () => {
        const response = await apisImage.uploadImageMutiple(formData);
        if (response?.files) {
          const newImages = response?.files?.map((item: { url: string }) => ({
            id: uuidv4(),
            image: item?.url,
          }));
          setSelectedImage((prev) => [...prev, ...newImages]);
        }
      };

      uploadImage();
    }
  };

  const isFormValid = () => {
    return (
      data?.name?.trim() !== "" &&
      data?.categoryId?.trim() !== "" &&
      data?.country?.trim() !== "" &&
      data?.city?.trim() !== "" &&
      data?.district?.trim() !== "" &&
      data?.street?.trim() !== "" &&
      selectedAmenities?.length > 0 &&
      selectedHighLight?.length > 0 &&
      selectedImage?.length >= 5
    );
  };

  // Hàm kiểm tra xem có thay đổi dữ liệu không
  const hasChanges = () => {
    return (
      JSON.stringify(data) !== JSON.stringify(initialData) ||
      JSON.stringify(selectedAmenities) !== JSON.stringify(initialAmenities) ||
      JSON.stringify(selectedHighLight) !== JSON.stringify(initialHighLight) ||
      JSON.stringify(selectedImage) !== JSON.stringify(initialImage)
    );
  };

  const handleSubmit = () => {
    if (!hasChanges()) return;

    let dataSubmit: IPropertyCreate = {};
    dataSubmit.images = selectedImage;
    dataSubmit.amenities = selectedAmenities;
    dataSubmit.highlights = selectedHighLight;
    dataSubmit = { ...dataSubmit, ...data };

    if (data?.id) {
      const handleUpdate = async () => {
        try {
          setSpinner(true);
          const response = await apisProperty.updateProperty(
            data?.id,
            dataSubmit
          );

          if (response?.status === "OK") {
            toast.success("Cập nhật thông tin thành công!");
            setCheck((prev) => !prev);
            setSpinner(false);
          } else {
            toast.error("Cập nhật thông tin thất bại!");
          }
        } catch (error) {
          console.error("Error updating property:", error);
          toast.error("Đã xảy ra lỗi khi cập nhật thông tin!");
          setSpinner(false);
          setCheck((prev) => !prev);
        }
      };
      handleUpdate();
    } else {
      const handleSaveData = async () => {
        try {
          setSpinner(true);
          dataSubmit.userId = user?.id;
          const response = await apisProperty.createProperty(dataSubmit);

          if (response?.status === "OK") {
            toast.success("Tạo thông tin thành công!");
            setCheck((prev) => !prev);
            setSpinner(false);
          } else {
            toast.error("Tạo thông tin thất bại!");
            setSpinner(false);
          }
        } catch (error) {
          console.error("Error updating property:", error);
          toast.error("Đã xảy ra lỗi khi tạo thông tin!");
          setCheck((prev) => !prev);
        }
      };

      handleSaveData();
    }
  };

  const handleRemoveImage = (id: string) => {
    setSelectedImage((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Thông tin homestay</h1>

      <h3 className="mt-8 text-md font-semibold flex items-center gap-2">
        Thông tin ảnh
        <p className="text-sm text=gray-300">(Chọn tối thiểu 5 ảnh)</p>
      </h3>

      <div className="grid grid-cols-6 gap-2 mt-2">
        {selectedImage?.map((item: { image: string; id: string }) => (
          <div
            key={item?.id}
            className="relative"
            onMouseEnter={() => setShowTrash(item?.id)}
            onMouseLeave={() => setShowTrash("")}
          >
            <img
              key={item?.id}
              alt="image"
              className="h-[160px] w-full rounded-md object-cover"
              src={item?.image}
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
              <FaPlus size={25} className="text-blue-700" />
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

      <h4 className="mt-8 text-2xl font-semibold">
        Thông tin chi tiết homestay
      </h4>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex flex-col gap-2 w-[70%]">
          <label className="font-semibold text-md">Tên homestay</label>
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

        <div className="w-[30%] flex flex-col gap-2">
          <label className="font-semibold text-md">Danh mục</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={data.categoryId || "0"} // Giá trị mặc định từ state
              onChange={(e) => setData({ ...data, categoryId: e.target.value })}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"0"}>Chọn danh mục</MenuItem>
              {categories?.map((item: { id: string; name: string }) => (
                <MenuItem key={item?.id} value={item?.id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="flex items-center mt-6 gap-4">
        <div className="flex flex-col gap-2 flex-2">
          <label className="font-semibold text-md">Quốc gia</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={data.country || "0"} // Giá trị mặc định từ state
              onChange={(e) => setData({ ...data, country: e.target.value })}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"0"}>Chọn quốc gia</MenuItem>
              <MenuItem value={"Việt Nam"}>Việt Nam</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2 flex-2">
          <label className="font-semibold text-md">Tỉnh / Thành phố</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={data.city || "0"} // Giá trị mặc định từ state
              onChange={(e) => {
                const selectedCity = cities.find(
                  (city) => city.name === e.target.value
                );
                if (selectedCity) {
                  setProvinceCode(selectedCity.code); // Lưu `code` vào state
                }
                setData({
                  ...data,
                  city: e.target.value, // Lưu `name` vào state
                });
              }}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"0"}>Chọn tỉnh / thành phố</MenuItem>
              {cities?.map((item: { name: string; code: string }) => (
                <MenuItem key={item.code} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2 flex-2">
          <label className="font-semibold text-md">Quận / Huyện</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={data.district || "0"} // Giá trị mặc định từ state
              onChange={(e) =>
                setData({
                  ...data,
                  district: e.target.value,
                })
              }
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"0"}>Chọn thành quận / huyện</MenuItem>
              {districts?.map((item: { name: string; code: string }) => (
                <MenuItem key={item.code} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2 flex-4">
          <label className="font-semibold text-md">Địa chỉ</label>
          <TextField
            id="outlined-basic"
            value={data.street}
            onChange={(e) => setData({ ...data, street: e.target.value })}
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px", // Padding cho nội dung input
              },
            }}
            variant="outlined"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 h-[320px]">
        <label className="font-semibold text-md">Mô tả</label>

        <ReactQuill
          theme="snow"
          style={{ height: "250px" }}
          value={data?.description}
          onChange={(value) =>
            setData((prev) => ({ ...prev, description: value }))
          }
        />
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
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label className="font-semibold text-md">Các điểm nổi bật</label>

        <div className="grid grid-cols-2 gap-4">
          {highlights?.map((item: IHightlight) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={selectedHighLight.includes(item.id)}
                  onChange={() => handleCheckboxChangeHighlight(item.id)}
                />
              }
              label={
                <div className="flex items-center gap-3 w-full">
                  {iconMapHighlight[item.icon]}
                  <div className="w-full">
                    <p className="font-semibold">{item.name}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              }
              sx={{
                width: "100%", // Thiết lập chiều rộng 100% cho FormControlLabel
                "& .MuiFormControlLabel-label": {
                  width: "100%", // Thiết lập chiều rộng 100% cho label
                },
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={user?.id ? !isFormValid() && !hasChanges() : !hasChanges()}
          className={`flex items-center gap-2 py-3 px-8 text-white rounded-md font-semibold transition-300 ${
            user?.id
              ? isFormValid() && hasChanges()
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

          <span>{propertyId ? "Cập nhật thông tin" : "Tạo thông tin"}</span>
        </button>
      </div>
    </div>
  );
};

export default HomestayInformationClient;
