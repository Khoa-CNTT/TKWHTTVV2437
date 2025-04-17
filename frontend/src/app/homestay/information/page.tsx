"use client";

import { FaPlus } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const HomestayPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Thông tin homestay</h1>

      <h3 className="mt-8 text-md font-semibold">Thông tin ảnh</h3>

      <div className="grid grid-cols-6 gap-2 mt-2">
        <img
          className="h-full rounded-md object-cover"
          src="https://th.bing.com/th/id/OIP.5SY8olRR1r1yn-Q-QqKJzQHaEH?rs=1&pid=ImgDetMain"
        ></img>

        <img
          className="h-full rounded-md object-cover"
          src="https://www.allkpop.com/upload/2022/09/content/221205/web_data/allkpop_1663863057_untitled-1.jpg"
        ></img>

        <img
          className="h-full rounded-md object-cover"
          src="https://pbs.twimg.com/media/EaJbfVxXkAA_jIx.jpg:large"
        ></img>

        <div className="border-[2px] border-blue-700 flex items-center justify-center border-dashed cursor-pointer">
          <div>
            <div className="flex justify-center pb-3">
              <FaPlus size={25} className="text-blue-700" />
            </div>
            <span className="font-semibold">Chọn thêm ảnh</span>
          </div>
        </div>
      </div>

      <h4 className="mt-8 text-2xl font-semibold">
        Thông tin chi tiết homestay
      </h4>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex flex-col gap-2 w-[70%]">
          <label className="font-semibold text-md">Tên homestay</label>
          <TextField id="outlined-basic" variant="outlined" />
        </div>

        <div className="w-[30%] flex flex-col gap-2">
          <label className="font-semibold text-md">Danh mục</label>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              // value={age}
              // label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Homestay</MenuItem>
              <MenuItem value={20}>Resort</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="flex items-center mt-6 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-md">Quốc gia</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={10}
              // label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Chọn quốc gia</MenuItem>
              <MenuItem value={100}>Việt Nam</MenuItem>
              <MenuItem value={20}>Thái Lan</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-md">Tỉnh / Thành phố</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={100}
              // label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={100}>Chọn tỉnh / thành phố</MenuItem>
              <MenuItem value={10}>Đà Nẵng</MenuItem>
              <MenuItem value={20}>Hội An</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-md">Quận / Huyện</label>

          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={100}
              // label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={100}>Chọn thành quận / huyện</MenuItem>
              <MenuItem value={10}>Cẩm Lệ</MenuItem>
              <MenuItem value={20}>Liên chiểu</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col gap-2 w-[70%]">
          <label className="font-semibold text-md">Địa chỉ</label>
          <TextField id="outlined-basic" variant="outlined" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 h-[320px]">
        <label className="font-semibold text-md">Mô tả</label>

        <ReactQuill
          theme="snow"
          style={{ height: "250px" }}
          //   value={value}
          //   onChange={setValue}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label className="font-semibold text-md">Thông tin các tiện ích</label>

        <div className="grid grid-cols-6 gap-4">
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel control={<Checkbox />} label="Label" />
          <FormControlLabel control={<Checkbox />} label="Label" />
          <FormControlLabel control={<Checkbox />} label="Label" />
        </div>
      </div>
    </div>
  );
};

export default HomestayPage;
