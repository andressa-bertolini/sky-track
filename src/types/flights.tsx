export interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: number;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  geo_altitude: number | null;
  squawk: string | null;
}

export interface FlightsState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

export type RawFlightState = (string | number | null)[];