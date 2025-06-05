import RecentFlightsPanel from '../components/RecentFlightsPanel';
import FlightSearchPanel from '../components/FlightSearchPanel';

export default function Home() {
  return (
    <div className="grid grid-cols-12 px-6">
      <div className="col-span-3">
        <RecentFlightsPanel />
      </div>
      <div className="col-start-10 col-span-3">
        <FlightSearchPanel />
      </div>
    </div>
  );
}
