import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActiveFlights } from '../services/flightsService';
import type { Flight, FlightsState, RawFlightState } from '../types/flights';

export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights', 
  async (_, { rejectWithValue }) => {
    try {
      const states = await getActiveFlights();
      
      if (!states || !Array.isArray(states)) {
        return [];
      }

      return states
      .filter((flight: RawFlightState) => flight && flight.length > 14)
      .map((flight: RawFlightState): Flight => ({
        icao24: flight[0] as string || '',
        callsign: (flight[1] as string)?.trim() || '',
        origin_country: flight[2] as string || '',
        time_position: flight[3] as number | null,
        last_contact: flight[4] as number,
        longitude: flight[5] as number | null,
        latitude: flight[6] as number | null,
        baro_altitude: flight[7] as number | null,
        on_ground: flight[8] as number,
        velocity: flight[9] as number | null,
        true_track: flight[10] as number | null,
        vertical_rate: flight[11] as number | null,
        geo_altitude: flight[13] as number | null,
        squawk: flight[14] as string | null,
      }))
      .filter((flight: Flight) => 
        flight.longitude !== null && 
        flight.latitude !== null
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
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