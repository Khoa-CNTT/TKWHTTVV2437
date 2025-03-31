const apiRoom = {
  getListRoom: async () => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/room/list-room`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apiRoom;
