import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Textarea from "@mui/joy/Textarea";
import { IProperty } from "@/app/types/property";

interface IDataEnter {
  resId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  imageBanking: string | null;
  nameAccount: string;
  numberAccount: string;
  nameBank: string;
}

interface IInvalidField {
  name: string;
  mes: string;
}

interface IProps {
  property: IProperty | null;
  handleStep2: (data: object) => void;
  dataEnter: IDataEnter;
  onChangeDataEnter: (
    newData: IDataEnter | ((prev: IDataEnter) => IDataEnter)
  ) => void;
  invalidFields?: IInvalidField[];
  setInvalidFields?: React.Dispatch<React.SetStateAction<IInvalidField[]>>;
}

const ContentCheckout: React.FC<IProps> = ({
  property,
  handleStep2,
  dataEnter,
  onChangeDataEnter,
  invalidFields,
  setInvalidFields,
}) => {
  // const [dataEnter, setDataEnter] = React.useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   message: "",
  // });

  // React.useEffect(() => {
  //   console.log("Data entered:", dataEnter);
  // }, [dataEnter]);

  const haddleOnFocus = () => {
    if (setInvalidFields) {
      setInvalidFields([]);
    }
  };
  return (
    <div>
      <div className="border-[1px] border-gray-300 rounded-lg p-8 mt-4 w-full">
        <h3 className="font-semibold text-lg mb-8">Nhập thông tin liên lạc</h3>

        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1 } }}
          noValidate
          autoComplete="off"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="w-2/5">
              <TextField
                className="w-full"
                id="outlined-basic"
                label="Tên"
                variant="outlined"
                value={dataEnter.firstName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeDataEnter((prev) => ({
                    ...prev,
                    firstName: event.target.value,
                  }));
                }}
                onFocus={haddleOnFocus}
              />
              {invalidFields?.some((el) => el.name === "firstName") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "firstName")?.mes}
                </p>
              )}
            </div>

            <div className="w-3/5">
              <TextField
                className="w-full"
                id="filled-basic"
                label="Họ"
                variant="outlined"
                value={dataEnter.lastName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeDataEnter((prev) => ({
                    ...prev,
                    lastName: event.target.value,
                  }));
                }}
                onFocus={haddleOnFocus}
              />
              {invalidFields?.some((el) => el.name === "lastName") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "lastName")?.mes}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start gap-2 pt-2">
            <div className="w-3/5">
              <TextField
                className="w-full"
                id="standard-basic"
                label="Email"
                variant="outlined"
                value={dataEnter.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeDataEnter((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }));
                }}
                onFocus={haddleOnFocus}
              />
              {invalidFields?.some((el) => el.name === "email") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "email")?.mes}
                </p>
              )}
            </div>

            <div className="w-2/5">
              <TextField
                className="w-full"
                id="standard-basic"
                label="Sô điện thoại"
                variant="outlined"
                value={dataEnter.phone}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeDataEnter((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }));
                }}
                onFocus={haddleOnFocus}
              />
              {invalidFields?.some((el) => el.name === "phone") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "phone")?.mes}
                </p>
              )}
            </div>
          </div>
        </Box>
      </div>

      <div className="border-[1px] border-gray-300 rounded-lg p-8 mt-4 w-full">
        <h3 className="font-semibold text-lg mb-8">
          Nhập thông tin tài khoản ngân hàng của bạn
        </h3>
        <div className="p-4 border border-red-500 text-red-500 italic text-[-14] mb-8 rounded-2xl">
          Thông tin này để hoàn tiền lại tài khoản của bạn
        </div>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1 } }}
          noValidate
          autoComplete="off"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="w-1/2">
              <TextField
                className="w-full"
                id="outlined-basic"
                label="Số tài khoản"
                placeholder="VD: 123456789"
                variant="outlined"
                value={dataEnter.numberAccount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeDataEnter((prev) => ({
                    ...prev,
                    numberAccount: event.target.value,
                  }));
                }}
                onFocus={haddleOnFocus}
              />
              {invalidFields?.some((el) => el.name === "numberAccount") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "numberAccount")?.mes}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <TextField
                className="w-full"
                id="filled-basic"
                label="Chủ tài khoản"
                placeholder="VD: Nguyen Van A"
                variant="outlined"
                value={dataEnter.nameAccount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeDataEnter((prev) => ({
                    ...prev,
                    nameAccount: event.target.value,
                  }));
                }}
                onFocus={haddleOnFocus}
              />
              {invalidFields?.some((el) => el.name === "nameAccount") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "nameAccount")?.mes}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start gap-2 pt-2">
            <div className="w-full">
              <TextField
                className="w-full"
                id="standard-basic"
                label="Tên ngân hàng"
                placeholder="VD: Techcombank(TCB)"
                variant="outlined"
                value={dataEnter.nameBank}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeDataEnter((prev) => ({
                    ...prev,
                    nameBank: event.target.value,
                  }));
                }}
                onFocus={haddleOnFocus}
              />
              {invalidFields?.some((el) => el.name === "nameBank") && (
                <p className="mt-0.5 text-[-12] text-red-600 italic">
                  {invalidFields.find((el) => el.name === "nameBank")?.mes}
                </p>
              )}
            </div>
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
            onChangeDataEnter((prev) => ({
              ...prev,
              message: event.target.value, // Cập nhật giá trị message trong state
            }));
          }}
        />
      </div>

      <div>
        <p className="mt-6 text-sm text-gray-600">
          Nhấn và nút Tiếp tục tiến đến quá trình thanh toán tiếp theo
        </p>
        <div className="flex justify-end">
          <button
            className="text-white font-semibold bg-blue-600 px-20 py-3 rounded-3xl mt-8 hover:bg-blue-700 transition duration-300 ease-in-out"
            onClick={() => {
              handleStep2(dataEnter);
            }}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};
export default ContentCheckout;
