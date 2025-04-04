const ReviewItem = () => {
  return (
    <div className="border border-gray-300 rounded-xl p-2 shadow-md">
      <h2 className="font-medium">8/10 Good</h2>
      <p className="mt-4 text-sm">
        The house fit our needs, we walked to amphitheater and downtown. Nice
        neighborhood. The indoor and outdoor spaces were great for the 6 of us
        to sit aroun
      </p>

      <p className="text-sm text-blue-600 mt-4 mb-4">See more</p>

      <div className="mt-auto mt-4">
        <p className="font-semibold text-sm">Amanda K.</p>
        <p className="text-sm">Ngày 22-12-2023</p>
      </div>
    </div>
  );
};

export default ReviewItem;
