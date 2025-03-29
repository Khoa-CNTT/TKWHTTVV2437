

const Header = () => {
  return (
    <header className="bg-white text-white p-4">
      <div className="w-[1260px] mx-auto flex justify-between items-center">
        <h2 className="font-bold text-[22px] text-blue-700">HRTravel</h2>

        <div>
            <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-sm cursor-pointer font-medium mr-2 transition duration-300">
                Register
            </button>
            <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-sm cursor-pointer font-medium transition duration-300 ml-2">
                Sign Up
            </button>
        </div>
      </div>
    </header>
  );
}

export default Header;