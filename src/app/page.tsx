import RecentFlights from '../components/RecentFlights';
import FlightSearch from '../components/FlightSearch';
import Map from '../components/Map';

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      <div className="absolute top-6 left-6 z-10 space-y-6">
        <RecentFlights />
      </div>
      <div className="absolute top-6 right-6 z-10 space-y-6">
        <FlightSearch />
      </div>
    </div>
  );
}
