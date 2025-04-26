const apisCategory = {
  getAllList: async () => {
    const response = await fetch(`${process.env.URL_SERVER_API}/category`, {
      method: "GET",
      cache: "no-store",
    });

    return response.json();
  },
};

export default apisCategory;
