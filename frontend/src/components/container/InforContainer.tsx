
const InforContainer = () => {
    return (
        <div className="w-full h-[500px] bg-blue-500 rounded-xl mt-8 p-8 flex gap-10">
            <div className="flex-4 my-auto">
                <h4 className="text-3xl font-bold text-white">2025 Vacation Rentals of the Year</h4>
                <p className="text-white text-md mt-4">Announcing the exceptional private vacation rentals that offer unforgettable group getaways.</p>
            </div>

            <div className="flex-6">
                <img className="rounded-md w-full h-full" src="https://forever.travel-assets.com/flex/flexmanager/mediaasset/1293916-0_2-Paradise%20Valley%20USA_%20918305.jpg?impolicy=fcrop&w=1400&h=600&q=mediumHigh" alt="" />
            </div>
        </div>
    );
}

export default InforContainer;