const apisProperty = {
  getListTop10Rating: async () => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/list-top-10-rating`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getPropertyBySlug: async (slug: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/detail/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getPropertyById: async (id: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/property/detail-id/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisProperty;
