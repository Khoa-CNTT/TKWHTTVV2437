const apisSummary = {
  getAllList: async () => {
    const response = await fetch(`${process.env.URL_SERVER_API}/summary`, {
      method: "GET",
      cache: "no-store",
    });

    return response.json();
  },
};

export default apisSummary;
