import MenuSearchContainer from "@/components/container/MenuSearchContainer";
import ListPropertySearch from "@/components/container/ListPropertySearch";
import apisAddress from "@/apis/address";

const SearchPage = async () => {
  const province = await apisAddress.getListProvince();

  return (
    <div className="pt-4 w-[1260px] mx-auto">
      <MenuSearchContainer
        provinces={province.data.data.map(
          (item: { name: string; code: string }) => ({
            name: item.name,
            code: item.code,
          })
        )}
      />

      <ListPropertySearch />
    </div>
  );
};

export default SearchPage;
