import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Textarea from "@mui/joy/Textarea";
import { IProperty } from "@/app/types/property";

interface IProps {
  property: IProperty | null;
}

const ContentCheckout: React.FC<IProps> = ({ property }) => {
  const [dataEnter, setDataEnter] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  React.useEffect(() => {
    console.log("Data entered:", dataEnter);
  }, [dataEnter]);

  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <p className="text-2xl font-semibold">Begin your booking</p>
        <p className="text-gray-500">Bước 1/2 </p>
      </div>

      <div className="border-[1px] border-gray-300 rounded-lg p-8 mt-4">
        <h3 className="font-semibold text-lg mb-8">Nhập thông tin liên lạc</h3>

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1 } }}
          noValidate
          autoComplete="off"
        >
          <div className="flex justify-between items-center gap-2">
            <TextField
              className="flex-1"
              id="outlined-basic"
              label="Tên"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDataEnter((prev) => ({
                  ...prev,
                  firstName: event.target.value,
                }));
              }}
            />
            <TextField
              className="flex-1"
              id="filled-basic"
              label="Họ"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDataEnter((prev) => ({
                  ...prev,
                  lastName: event.target.value,
                }));
              }}
            />
          </div>
          <div className="flex justify-between items-center gap-2 pt-2">
            <TextField
              className="flex-1"
              id="standard-basic"
              label="Email"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDataEnter((prev) => ({
                  ...prev,
                  email: event.target.value,
                }));
              }}
            />
            <TextField
              className="flex-1"
              id="standard-basic"
              label="Sô điện thoại"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDataEnter((prev) => ({
                  ...prev,
                  phone: event.target.value,
                }));
              }}
            />
          </div>
        </Box>
      </div>

      <div className="border-[1px] border-gray-300 rounded-lg p-8 mt-4">
        <h3 className="font-semibold text-lg mb-5">
          Tin nhắn cho chủ homestay
        </h3>

        <div className="flex gap-4">
          <img
            className="rounded-full w-[50px] h-[50px] object-cover"
            src="https://th.bing.com/th/id/R.2dbede307b3c506c10c620ec96665caa?rik=%2fickOaxn66GHxg&riu=http%3a%2f%2fwww.psi-solutions.org%2fwp-content%2fuploads%2fdefault-avatar-profile-icon-of-social-media-user-vector-768x768.jpg&ehk=vTohsCcYIkdH398ZZ32%2bw5C4WEYO3VM%2fgP2aOj12N6M%3d&risl=&pid=ImgRaw&r=0"
          ></img>

          <div>
            <p className="font-semibold">{property?.name}</p>
            <span className="border-[1px] border-gray-300 text-[11px] px-3 py-[3px] rounded-3xl text-gray-500">
              Chủ
            </span>
          </div>
        </div>

        <Textarea
          className="mt-4"
          placeholder="Tin nhắn của bạn"
          minRows={4}
          sx={{
            "&::before": {
              display: "none",
            },
            "&:focus-within": {
              outline: "2px solid var(--Textarea-focusedHighlight)",
              outlineOffset: "2px",
            },
          }}
          value={dataEnter.message} // Hiển thị giá trị từ state
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setDataEnter((prev) => ({
              ...prev,
              message: event.target.value, // Cập nhật giá trị message trong state
            }));
          }}
        />
      </div>

      <div>
        <p className="mt-6 text-sm text-gray-600">
          Nhấn và nút "Tiếp tục" tiến đến quá trình thanh toán tiếp theo
        </p>
        <div className="flex justify-end">
          <button className="text-white font-semibold bg-blue-600 px-20 py-3 rounded-3xl mt-8 hover:bg-blue-700 transition duration-300 ease-in-out">
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};
export default ContentCheckout;
