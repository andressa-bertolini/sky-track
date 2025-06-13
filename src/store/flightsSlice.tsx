import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActiveFlights } from '../services/flightsService';

interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  geo_altitude: number | null;
  squawk: string | null;
}

interface FlightsState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights', 
  async (_, { rejectWithValue }) => {
    try {
      const states = await getActiveFlights();
      
      if (!states || !Array.isArray(states)) {
        return [];
      }

      return states
        .filter((flight: any[]) => flight && flight.length > 14)
        .map((flight: any[]) => ({
          icao24: flight[0] || '',
          callsign: flight[1]?.trim() || '',
          origin_country: flight[2] || '',
          time_position: flight[3],
          last_contact: flight[4] || 0,
          longitude: flight[5],
          latitude: flight[6],
          baro_altitude: flight[7],
          on_ground: flight[8] || false,
          velocity: flight[9],
          true_track: flight[10],
          vertical_rate: flight[11],
          geo_altitude: flight[13],
          squawk: flight[14],
        }))
        .filter((flight: Flight) => 
          flight.longitude !== null && 
          flight.latitude !== null
        );
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error');
    }
  }
);

const initialState: FlightsState = {
  flights: [],
  loading: false,
  error: null,
};

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFlights: (state) => {
      state.flights = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
        state.error = null;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error';
      });
  },
});

export const { clearError, clearFlights } = flightsSlice.actions;
export default flightsSlice.reducer;