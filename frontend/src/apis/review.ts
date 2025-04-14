const apisReview = {
  getReviewByProperty: async (propertyId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/review/rating-by-property/${propertyId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
};

export default apisReview;
