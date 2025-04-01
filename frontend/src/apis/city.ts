const apisCity = {
  getListTop10City: async () => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/city/list-top-10-city`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisCity;
