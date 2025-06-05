export default function FlightSearchPanel() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Search</h2>
        <div className="bg-black-70 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
        Airline
        Date 
        Flight Number
        <button>Search</button>
        </div>
    </div>
  );
}