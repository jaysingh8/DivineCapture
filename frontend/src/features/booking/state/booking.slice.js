import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        myBookings: [],
        providerBookings: [],
        nearbyProviders: [],
        loading: false,
        error: null,
    },
    reducers: {
        setMyBookings: (state, action) => {
            state.myBookings = action.payload;
        },
        setProviderBookings: (state, action) => {
            state.providerBookings = action.payload;
        },
        setNearbyProviders: (state, action) => {
            state.nearbyProviders = action.payload;
        },
        // Optimistically update a single booking's status in providerBookings list
        updateProviderBookingStatus: (state, action) => {
            const { bookingId, status, booking } = action.payload;
            const idx = state.providerBookings.findIndex((b) => b._id === bookingId);
            if (idx !== -1) {
                state.providerBookings[idx] = booking ?? { ...state.providerBookings[idx], status };
            }
        },
        // Optimistically update a single booking's status in myBookings list
        updateMyBookingStatus: (state, action) => {
            const { bookingId, status, booking } = action.payload;
            const idx = state.myBookings.findIndex((b) => b._id === bookingId);
            if (idx !== -1) {
                state.myBookings[idx] = booking ?? { ...state.myBookings[idx], status };
            }
        },
        // Prepend new booking (from socket) to providerBookings
        addProviderBooking: (state, action) => {
            const exists = state.providerBookings.some((b) => b._id === action.payload._id);
            if (!exists) {
                state.providerBookings.unshift(action.payload);
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setMyBookings,
    setProviderBookings,
    setNearbyProviders,
    updateProviderBookingStatus,
    updateMyBookingStatus,
    addProviderBooking,
    setLoading,
    setError,
    clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;