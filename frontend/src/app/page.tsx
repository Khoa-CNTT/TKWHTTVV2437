import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import ContainerRecomend from "@/components/container/ContainerRecomend";
import ContainerRoom from "@/components/container/ContainerRoom";
import InforContainer from "@/components/container/InforContainer";

export default function Home() {
  return (
    <div>
      <Banner />

      <div className="mt-8 w-[1260px] mx-auto">
        <ContainerRecomend />

        <Container />

        <ContainerRoom />

        <InforContainer />
      </div>
    </div>
  );
}