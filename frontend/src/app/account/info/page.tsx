import EditAddressInfo from "@/components/editBasicInfo/EditAddressInfo";
import EditBasicInfo from "@/components/editBasicInfo/EditBasicInfo";
import InfoUser from "@/components/infoUser/InfoUser";

const Info = () => {
  return (
    <div className="w-full">
      <InfoUser />
      <EditBasicInfo />
      <EditAddressInfo />
    </div>
  );
};
export default Info;
