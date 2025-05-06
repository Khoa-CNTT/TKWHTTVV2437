const apisReservation = {
  getDataBarChart: async (
    propertyId: string,
    query: Record<string, string | number>
  ) => {
    // Tạo query string từ object query
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/reservation/bar-chart/${propertyId}?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisReservation;
