'use client';

import './RecentFlights.css';
import rawAirports from '@/data/airports.json';

const airports = rawAirports as Record<string, Airport>;
import mockFlights from '@/data/mockFlights.json';

function getAirportInfo(code: string): Airport | undefined {
  return airports[code];
}

type Airport = {
  icao: string;
  iata: string | null;
  name: string;
  city: string;
  state: string;
  country: string;
  elevation: number;
  lat: number;
  lon: number;
  tz: string;
};

export default function RecentFlightsPanel() {

  return (
    <div className="recent-flights">
      <h2 className="text-xl font-semibold mb-2">Recent Flights</h2>
      <ul className="recent-flights-container scrollbar-dark-thin space-y-3 pr-1">
        {mockFlights.map((flight, index) => {
          const isDelayed = false;
          
          return(
          <li
            key={index}
            className="bg-black-70 border border-gray-200 rounded-lg p-4"
          >
            <p className="font-medium">
              {getAirportInfo(flight.origin.icao)?.city || flight.origin.airport} ({flight.origin.iata})
              &nbsp;→&nbsp;
              {getAirportInfo(flight.destination.icao)?.city || flight.destination.airport} ({flight.destination.iata})
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Flight: {flight.callsign} • {flight.airline}
                </p>
                <p className="text-xs text-gray-400">
                  Altitude: {Math.round(flight.altitude)}m • Speed: {Math.round(flight.velocity)} km/h
                </p>
              </div>
              <span
                className={`text-xs font-semibold mt-[5px] px-[6px] rounded-full ${
                  isDelayed ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
                }`}
              >
                {flight.status}
              </span>
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}