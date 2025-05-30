import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import ContainerRecomend from "@/components/container/ContainerRecomend";
import ContainerRoom from "@/components/container/ContainerRoom";
import InforContainer from "@/components/container/InforContainer";
import apisProperty from "@/apis/property";
import apisCity from "@/apis/city";
import IconChat from "@/components/chat/IconChat";
import Footer from "@/components/header/Footer";

export default async function Home() {
  const properties = await apisProperty.getListTop10Rating();
  const cities = await apisCity.getListTop10City();

  return (
    <div className="relative">
      <div className="fixed bottom-[80px] right-[80px] z-10">
        <IconChat />
      </div>
      <Banner />

      <div className="w-[1260px] mx-auto z-0">
        <ContainerRecomend />

        <Container cities={cities.data} />

        <div className="mt-8">
          <ContainerRoom properties={properties.data} />
        </div>

        <InforContainer />
      </div>

      <Footer />
    </div>
  );
}
