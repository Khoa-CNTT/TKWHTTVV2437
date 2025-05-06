import SearchContainer from "../container/SearchContainer";

const Banner = () => {
  return (
    <div className="relative">
      <img
        src="https://forever.travel-assets.com/flex/flexmanager/images/2025/03/24/VRBO_APFT2_BARCELONA_THERIN_HOUSE_2_4605_1.png?impolicy=fcrop&w=1920&h=580&q=medium"
        alt="banner"
      />

      <div className="absolute left-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%]">
        <SearchContainer />
      </div>
    </div>
  );
};

export default Banner;
