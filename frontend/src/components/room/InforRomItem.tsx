const InforRomItem = () => {
  return (
    <div className="border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
      <img
        className="min-h-[250px] object-fit rounded-t-xl"
        src="https://images.trvl-media.com/lodging/20000000/19110000/19107300/19107268/139b07c5.jpg?impolicy=fcrop&w=600&h=400&p=1&q=high"
        alt="anh"
      />

      <div className="p-2">
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-green-700 font-medium text-sm text-white px-1 rounded-md">
            9.8
          </span>
          <p className="text-sm">
            Exceptional <span>(6 reviews)</span>
          </p>
        </div>
        <h4 className="text-[16px] font-semibold mt-1">
          Goergeous RiverBluff View of the White River + WIFI
        </h4>
        <p className="text-sm mt-1">Calico Rock, AR</p>
        <p className="text-md font-semibold mt-2">$150</p>
        <p className="text-[12px]">per night</p>
        <p className="text-[12px]">$350 total</p>
      </div>
    </div>
  );
};

export default InforRomItem;
