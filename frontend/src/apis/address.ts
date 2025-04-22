const apisAddress = {
  getListProvince: async () => {
    const response = await fetch(
      `https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getListDistrict: async (provinceCode: string) => {
    const response = await fetch(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisAddress;
