import MenuSearchContainer from "@/components/container/MenuSearchContainer";
import ListPropertySearch from "@/components/container/ListPropertySearch";
import apisAddress from "@/apis/address";
import Footer from "@/components/header/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Love Trip",
  description: "Tìm kiếm những khoảnh khắc đáng nhớ",
};

const SearchPage = async () => {
  const province = await apisAddress.getListProvince();

  return (
    <div>
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

      <Footer />
    </div>
  );
};

export default SearchPage;
