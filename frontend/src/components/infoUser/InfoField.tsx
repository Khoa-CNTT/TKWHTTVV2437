interface IInfoField {
  title: string;
  label?: string;
}

const InfoField = ({ title, label }: IInfoField) => {
  return (
    <div className="w-full md:w-1/2 mt-4">
      <h3 className="text-[-14] text-[text] font-semibold">{title}</h3>
      <p className="text-[-14] text-[text]">{label || "Chưa cung cấp"}</p>
    </div>
  );
};

export default InfoField;
