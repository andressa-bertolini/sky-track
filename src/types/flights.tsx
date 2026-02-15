export interface Flight {
  icao24: string;
  callsign: string;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  velocity: number | null;
  heading: number | null;
  origin: {
    airport: string;
    iata: string;
    icao: string;
    timezone: string;
  };
  destination: {
    airport: string;
    iata: string;
    icao: string;
    timezone: string;
  };
  airline: string;
  aircraft: string;
  status: string;
  origin_country?: string;
  time_position?: number | null;
  last_contact?: number;
  baro_altitude?: number | null;
  on_ground?: number;
  true_track?: number | null;
  vertical_rate?: number | null;
  geo_altitude?: number | null;
  squawk?: string | null;
}

export interface FlightsState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

export type RawFlightState = (string | number | null)[];