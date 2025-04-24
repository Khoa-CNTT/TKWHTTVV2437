import { IRoom, IRoomCreate } from "@/app/types/room";

const apisRoom = {
  getListRoomByPropertyId: async (propertyId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/room/list-room/${propertyId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getDetailById: async (roomId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/room/detail/${roomId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  createRoom: async(data:IRoomCreate) => {
      const response = await fetch(
        `${process.env.URL_SERVER_API}/room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
          body: JSON.stringify(data), // Serialize the data object
        }
      );
  
      return response.json();
    },

  updateRoom: async(roomId: string, data:IRoomCreate) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/room/${roomId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(data), // Serialize the data object
      }
    );

    return response.json();
  }
};

export default apisRoom;
