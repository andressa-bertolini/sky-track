import mockFlights from '../data/mockFlights.json';

// Toggle between mock and real API
const USE_MOCK_DATA = true; // Set to false to use real API

export async function getActiveFlights({ 
  limit = 50
} = {}) {
  // If using mock data, return it immediately
  if (USE_MOCK_DATA) {
    console.log('Using mock flight data for demonstration');
    
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Loaded ${mockFlights.length} mock flights from static JSON`);
    
    return mockFlights.slice(0, limit);
  }
  
  // Real API code (AviationStack - keeping for reference)
  const apiKey = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY;
  const baseUrl = 'http://api.aviationstack.com/v1/flights';
  
  const params = new URLSearchParams({
    access_key: apiKey,
    limit: limit.toString(),
    flight_status: 'active',
  });

  const url = `${baseUrl}?${params}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('Total flights from API:', data.data?.length || 0);
    
    const flights = data.data
      ?.filter((flight: any) => {
        return flight.live && 
               flight.live.latitude !== null && 
               flight.live.longitude !== null;
      })
      .map((flight: any) => ({
        icao24: flight.aircraft?.icao24 || flight.flight?.icao || flight.flight?.iata,
        callsign: flight.flight?.iata || flight.flight?.icao,
        
        latitude: flight.live.latitude,
        longitude: flight.live.longitude,
        altitude: flight.live.altitude,
        velocity: flight.live.speed_horizontal,
        heading: flight.live.direction,
        
        origin: {
          airport: flight.departure?.airport,
          iata: flight.departure?.iata,
          icao: flight.departure?.icao,
          timezone: flight.departure?.timezone,
        },
        destination: {
          airport: flight.arrival?.airport,
          iata: flight.arrival?.iata,
          icao: flight.arrival?.icao,
          timezone: flight.arrival?.timezone,
        },
        
        airline: flight.airline?.name,
        aircraft: flight.aircraft?.registration,
        status: flight.flight_status,
        
        raw: flight,
      })) || [];
    
    console.log('Flights with live tracking:', flights.length);
    
    return flights;
  } catch (error) {
    console.error('Error fetching flights from AviationStack:', error);
    throw error;
  }
}