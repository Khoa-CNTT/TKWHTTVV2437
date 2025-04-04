const apisRoom = {
  getListTop10Rating: async () => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/room/list-top-10-rating`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getRoomBySlug: async (slug: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/room/detail/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisRoom;
