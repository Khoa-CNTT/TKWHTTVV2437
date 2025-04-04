import ButtonLogin from "../button/ButtonLogin";
import InputText from "../input/InputText";

interface IInvalidField {
  name: string;
  mes: string;
}

interface IEmailForm {
  titleHeader: string;
  labelHeader: string;
  labelBtn: string;
  labelInput: string;
  typeInput: string;
  idInput: string;
  value: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
  invalidFields?: IInvalidField[];
  setInvalidFields?: React.Dispatch<React.SetStateAction<IInvalidField[]>>;
}

const InputForm = ({
  titleHeader,
  labelHeader,
  labelBtn,
  labelInput,
  typeInput,
  idInput,
  value,
  onClick,
  onChange,
  disabled,
  invalidFields,
  setInvalidFields,
}: IEmailForm) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold py-6">{titleHeader}</h1>
      <p className="text-sm mb-6">{labelHeader}</p>
      <div>
        <InputText
          value={value}
          type={typeInput}
          label={labelInput}
          id={idInput}
          onChange={onChange}
          invalidFields={invalidFields}
          setInvalidFields={setInvalidFields}
        />

        <div className="mt-10">
          <ButtonLogin text={labelBtn} onClick={onClick} disable={disabled} />
        </div>
      </div>
    </div>
  );
};

export default InputForm;
