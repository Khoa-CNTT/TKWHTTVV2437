const apisReview = {
  getReviewByRoom: async (roomId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/review/rating-by-room/${roomId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisReview;
