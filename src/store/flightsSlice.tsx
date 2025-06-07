import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecentFlights } from '../lib/flightsService';

export const fetchFlights = createAsyncThunk('flights/fetchFlights', async () => {
  return await getRecentFlights();
});

const flightsSlice = createSlice({
  name: 'flights',
  initialState: {
    flights: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro';
      });
  },
});

export default flightsSlice.reducer;