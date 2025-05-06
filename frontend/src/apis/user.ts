const apisUser = {
  getTotalDashboardAdmin: async () => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/user/total-dashboard-admin`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getDataLineChart: async (query: Record<string, string | number>) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    const response = await fetch(
      `${process.env.URL_SERVER_API}/user/data-line-chart-admin?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisUser;
