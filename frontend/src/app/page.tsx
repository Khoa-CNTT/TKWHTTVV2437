import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import ContainerRecomend from "@/components/container/ContainerRecomend";
import ContainerRoom from "@/components/container/ContainerRoom";
import InforContainer from "@/components/container/InforContainer";
import apisRoom from "@/apis/room";
import apisCity from "@/apis/city";

export default async function Home() {
  const rooms = await apisRoom.getListTop10Rating();
  const cities = await apisCity.getListTop10City();

  return (
    <div>
      <Banner />

      <div className="w-[1260px] mx-auto">
        <div className="mt-8">
          <ContainerRecomend rooms={rooms.data} />
        </div>

        <Container cities={cities.data} />

        <div className="mt-8">
          <ContainerRoom rooms={rooms.data} />
        </div>

        <InforContainer />
      </div>
    </div>
  );
}
