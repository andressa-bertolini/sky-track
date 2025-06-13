'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlights } from '../store/flightsSlice';
import { RootState, AppDispatch } from '../store';

import RecentFlights from '../components/RecentFlights';
import FlightSearch from '../components/FlightSearch';
import Map from '../components/Map';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { flights, loading, error } = useSelector((state: RootState) => state.flights);

  useEffect(() => {
    dispatch(fetchFlights());

    const interval = setInterval(() => {
      dispatch(fetchFlights());
    }, 1800000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-4 rounded">
          Loading...
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-500 text-white p-4 rounded max-w-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => dispatch(fetchFlights())}
            className="mt-2 bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* <div className="absolute top-6 left-6 z-10 space-y-6">
        <RecentFlights />
      </div> /}
      {/ <div className="absolute top-6 right-6 z-10 space-y-6">
        <FlightSearch />
      </div> */}
    </div>
  );
}