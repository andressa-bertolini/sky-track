import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getActiveFlights } from '../services/flightsService';
import type { Flight, FlightsState } from '../types/flights';

export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights', 
  async (_, { rejectWithValue }) => {
    try {
      const flights = await getActiveFlights();
      
      if (!flights || !Array.isArray(flights)) {
        return [];
      }

      return flights.filter((flight: Flight) => 
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