const apisAdvertising = {
  getListAdvertising: async () => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/advertising/list-advertising`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisAdvertising;
