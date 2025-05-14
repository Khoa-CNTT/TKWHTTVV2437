import ManagePropertyContent from "@/components/content/ManagePropertyContent";
import apisAddress from "@/apis/address";

const ManagePropertyPage = async () => {
  const province = await apisAddress.getListProvince();
  return (
    <div>
      <ManagePropertyContent
        provinces={province.data.data.map(
          (item: { name: string; code: string }) => ({
            name: item.name,
            code: item.code,
          })
        )}
      />
    </div>
  );
};

export default ManagePropertyPage;
