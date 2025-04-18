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
};

export default apisRoom;
