import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import ContainerRecomend from "@/components/container/ContainerRecomend";
import ContainerRoom from "@/components/container/ContainerRoom";
import InforContainer from "@/components/container/InforContainer";
import apiRoom from "@/apis/room";
import { MdRoomService } from "react-icons/md";

export default async function Home() {
  const rooms = await apiRoom.getListRoom();

  console.log(rooms);

  return (
    <div>
      <Banner />

      <div className="w-[1260px] mx-auto">
        <div className="mt-8">
          <ContainerRecomend />
        </div>

        <Container />

        <ContainerRoom rooms={rooms.data} />

        <InforContainer />
      </div>
    </div>
  );
}
