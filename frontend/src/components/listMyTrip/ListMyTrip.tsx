import BookingCard from "./BookingCard";

const ListMyTrip = () => {
  return (
    <div>
      <div>
        <h1 className="text-[32px] font-semibold">Đặt chỗ và chuyến đi</h1>
        <div className="mt-4">
          <BookingCard />
        </div>
      </div>
    </div>
  );
};

export default ListMyTrip;
