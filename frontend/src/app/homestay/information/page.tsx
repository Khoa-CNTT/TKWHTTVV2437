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

// import icon highlight
import { IoIosHeartEmpty } from "react-icons/io";
import { SlPicture } from "react-icons/sl";
import { FaBusAlt } from "react-icons/fa";
import { listItemSecondaryActionClasses } from "@mui/material";
import { IImage, IProperty } from "@/app/types/property";
import apisCategory from "@/apis/category";
import apisAddress from "@/apis/address";
import apisImage from "@/apis/image";

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

// set icon map highlight
const iconMapHighlight: { [key: string]: JSX.Element } = {
  FaParking: <FaParking size={30} />,
  IoIosHeartEmpty: <IoIosHeartEmpty size={30} />,
  SlPicture: <SlPicture size={30} />,
  FaBusAlt: <FaBusAlt size={30} />,
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
}

const propertyId = null;

const HomestayPage = () => {
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
    name: "",
    categoryId: "",
    country: "",
    city: "",
    district: "",
    street: "",
    description: "",
  });

  useEffect(() => {
    const fetchDataAmenities = async () => {
      const response = await apisAmenity.getAllList();

      if (response?.data) {
        setAmenities(response.data);
      }
    };

    const fetchDataHighLight = async () => {
      const response = await apisHighlight.getListAll();

      if (response?.data) {
        setHighLights(response.data);
      }
    };

    const fetchDataCategories = async () => {
      const response = await apisCategory.getAllList();
      if (response?.data) {
        setCategories(response.data);
      }
    };

    const fetchDataCities = async () => {
      const response = await apisAddress.getListProvince();
      if (response?.data) {
        setCities(
          response.data.data.map((item: { name: string; code: string }) => ({
            name: item.name,
            code: item.code,
          }))
        );
      }
    };

    const fetchDataProperty = async () => {
      const response = await apisProperty.getPropertyById(propertyId);
      if (response?.data) {
        console.log({ dataResponse: response.data });
        setData({
          name: response.data?.name,
          categoryId: response.data?.idCategory,
          country: response.data?.propertyAddress?.country,
          city: response.data?.propertyAddress.city,
          district: response.data?.propertyAddress.district,
          street: response.data?.propertyAddress.street,
          description: response.data?.description,
        });

        setSelectedAmenities(
          response.data.amenities.map((item: IAmenity) => item.id)
        );
        setSelectedHighLight(
          response.data.highlights.map((item: IHightlight) => item.id)
        );
        setSelectedImage(
          response.data.images.map((item: IImage) => ({
            image: item.image,
            id: item.id,
          }))
        );
      }
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchDataAmenities(),
          fetchDataHighLight(),
          fetchDataCategories(),
          fetchDataCities(),
          fetchDataProperty(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

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
    const selectedCity = cities.find((city) => city.name === data.city);
    if (selectedCity) {
      setProvinceCode(selectedCity.code); // Lưu `code` vào state
    }
  }, [data.city, cities]);

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await apisAddress.getListDistrict(provinceCode);
      if (response?.data) {
        setDistricts(
          response?.data?.data?.map((item: { name: string; code: string }) => ({
            name: item.name,
            code: item.code,
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
        return prev.filter((highlightId) => highlightId !== id);
      } else {
        // Nếu chưa chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
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

  const handleSubmit = () => {
    let dataSubmit:IPropertyCreate = {};
    dataSubmit.images = selectedImage;
    dataSubmit.amenities = selectedAmenities;
    dataSubmit.highlights = selectedHighLight;
    dataSubmit = {...dataSubmit, ...data};

    if (propertyId) {
      const handleUpdate = async() => {
        const response = await apisProperty.updateProperty(propertyId, dataSubmit);

        console.log(response)
      }
      handleUpdate();
    } else {
      console.log("handle create");
      console.log(dataSubmit);
      const handleSaveData = async() => {
        const response = await apisProperty.createProperty(dataSubmit);

        console.log({response})
      }

      handleSaveData();
    }

  }

  const handleRemoveImage = (id: string) => {
    setSelectedImage((prev) => (prev.filter(item => item.id !== id)))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Thông tin homestay</h1>

      <h3 className="mt-8 text-md font-semibold">Thông tin ảnh</h3>

      <div className="grid grid-cols-6 gap-2 mt-2">
        {selectedImage?.map((item: { image: string; id: string }) => (
          <div 
            className="relative" 
            onMouseEnter={() => setShowTrash(item.id)}
            onMouseLeave={() => setShowTrash('')}>
              <img
                
                key={item.id}
                alt="image"
                className="h-[160px] w-full rounded-md object-cover"
                src={item.image}
              ></img>

              {showTrash === item.id && 
                <button onClick={() => handleRemoveImage(item.id)} className="absolute top-[10px] right-[10px]">
                  <MdDeleteForever className="text-red-500" size={24}/>
                </button>
              }
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
          // disabled={isUploading}
          hidden
          // onChange={handleFileChange}
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
            {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              // value={age}
              // label="Age"
              // onChange={handleChange}
              value={data.categoryId || "0"} // Giá trị mặc định từ state
              onChange={(e) => setData({ ...data, categoryId: e.target.value })}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"0"}>Chọn danh mục</MenuItem>
              {categories.map((item: { id: string; name: string }) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
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
              // value={100}
              // label="Age"
              // onChange={handleChange}
              value={data.city || "0"} // Giá trị mặc định từ state
              onChange={(e) => {
                const selectedCity = cities.find(
                  (city) => city.name === e.target.value
                );
                if (selectedCity) {
                  setData({
                    ...data,
                    city: selectedCity.name, // Lưu `name` vào state
                  });
                  setProvinceCode(selectedCity.code); // Lưu `code` vào state
                }
              }}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"0"}>Chọn tỉnh / thành phố</MenuItem>
              {/* <MenuItem value={10}>Đà Nẵng</MenuItem>
              <MenuItem value={20}>Hội An</MenuItem> */}
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
              // label="Age"
              // onChange={handleChange}
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
                  {/* <FaParking size={30} /> */}
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
        <button onClick={handleSubmit} className="flex items-center gap-2 bg-green-700 py-3 px-8 text-white rounded-md font-semibold hover:opacity-90 transition-300">
          <VscSaveAs size={20} />
          <span>{propertyId ? 'Cập nhật thông tin' : 'Tạo thông tin'}</span>
        </button>
      </div>
    </div>
  );
};

export default HomestayPage;
