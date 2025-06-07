'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlights } from '../store/flightsSlice';
import { RootState } from '@/store';

import './RecentFlights.css';
import airports from '@/data/airports.json';
import mockFlights from '@/data/mockFlights.json';

function getAirportInfo(iata: string) {
  return airports[iata];
}

type Flight = {
  id: string;
  origin: string;
  destination: string;
  departure: string;
  status: 'on time' | 'delayed' | 'cancelled';
};

export default function RecentFlightsPanel() {
  const dispatch = useDispatch();
  const { flights, loading } = useSelector((state: RootState) => state.flights);

  useEffect(() => {
    //dispatch(fetchFlights() as any);
    //console.log(flights);
    console.log("airports:");
    //console.log(airports);
  }, [dispatch]);

  return (
    <div className="recent-flights">
      <h2 className="text-xl font-semibold mb-2">Recent Flights</h2>
      <ul className="recent-flights-container scrollbar-dark-thin space-y-3 pr-1">
        {mockFlights.map((flight) => {
          const isDelayed = flight.departure.delay && flight.departure.delay > 0;
          return(
          <li
            key={flight.id}
            className="bg-black-70 border border-gray-200 rounded-lg p-4"
          >
            <p className="font-medium">
              {getAirportInfo(flight.departure.icao)?.city} ({flight.departure.iata})
              &nbsp;→&nbsp;
              {getAirportInfo(flight.arrival.icao)?.city} ({flight.departure.iata})
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Departure: 
                  {new Date(flight.departure.scheduled).toLocaleString()}</p>
              </div>
              <span
                className={`text-xs font-semibold mt-[5px] px-[6px] rounded-full ${
                  isDelayed ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
                }`}
              >
                {isDelayed ? 'Delayed' : 'On time'}
              </span>
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}