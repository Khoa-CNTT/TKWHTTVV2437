const apisChatBot = {
  getMessage: async (text: string, sessionId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/ai?text=${text}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json", // Thêm header Content-Type
          "x-session-id": sessionId,
        },
      }
    );

    return response.json();
  },
};

export default apisChatBot;
