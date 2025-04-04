import classNames from "classnames";

interface IButtonLogin {
  text: string;
  inForm?: boolean;
  onClick?: () => void;
  disable?: boolean;
}

const ButtonLogin = ({ text, onClick, inForm, disable }: IButtonLogin) => {
  let button = classNames(
    "w-full py-3 rounded-3xl  text-[-14]  font-semibold "
  );
  if (inForm === false) {
    button = classNames(
      button,
      "text-blue-800 bg-white hover:text-blue-700 hover:bg-blue-200 hover:opacity-80"
    );
  } else {
    button = classNames(button, "bg-primary text-white hover:opacity-80");
  }

  if (disable === true) {
    button = classNames(
      "w-full py-3 rounded-3xl  text-[-14]  font-semibold  bg-blue-100 text-white  cursor-not-allowed"
    );
  }
  return (
    <button className={button} onClick={onClick} disabled={disable}>
      {text}
    </button>
  );
};

export default ButtonLogin;
