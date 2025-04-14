import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import ContainerRecomend from "@/components/container/ContainerRecomend";
import ContainerRoom from "@/components/container/ContainerRoom";
import InforContainer from "@/components/container/InforContainer";
import apisProperty from "@/apis/property";
import apisCity from "@/apis/city";

export default async function Home() {
  const properties = await apisProperty.getListTop10Rating();
  const cities = await apisCity.getListTop10City();

  return (
    <div>
      <Banner />

      <div className="w-[1260px] mx-auto">
        <div className="mt-8">
          <ContainerRecomend properties={properties.data} />
        </div>

        <Container cities={cities.data} />

        <div className="mt-8">
          <ContainerRoom properties={properties.data} />
        </div>

        <InforContainer />
      </div>
    </div>
  );
}
