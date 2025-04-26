const apisHighlight = {
  getListAll: async () => {
    const response = await fetch(`${process.env.URL_SERVER_API}/highlight`, {
      method: "GET",
      cache: "no-store",
    });

    return response.json();
  },
};

export default apisHighlight;
