const apisAmenity = {
  getAllList: async () => {
    const response = await fetch(`${process.env.URL_SERVER_API}/amenity`, {
      method: "GET",
      cache: "no-store",
    });

    return response.json();
  },
};

export default apisAmenity;
