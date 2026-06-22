import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import socket from "../../../socket.js";
import {
    addProviderBooking,
    updateMyBookingStatus,
} from "../state/booking.slice";

export const useBookingSocket = (user) => {
    const dispatch = useDispatch();
    const [newBookingAlert, setNewBookingAlert] = useState(null);
    const [bookingAcceptedAlert, setBookingAcceptedAlert] = useState(null);
    const [bookingDeclinedAlert, setBookingDeclinedAlert] = useState(null);

    useEffect(() => {
        if (!user?._id) return;

        // Register user on socket
        socket.emit("register", user._id);

        // Provider side: a new booking request arrived
        const handleNewBooking = (booking) => {
            // Push the new booking into the Redux providerBookings list immediately
            dispatch(addProviderBooking(booking));
            setNewBookingAlert(booking);
            setTimeout(() => setNewBookingAlert(null), 8000);
        };

        // User side: their booking was accepted
        const handleBookingAccepted = (booking) => {
            // Update the booking status in myBookings list immediately
            dispatch(updateMyBookingStatus({ bookingId: booking._id, booking }));
            setBookingAcceptedAlert(booking);
            setTimeout(() => setBookingAcceptedAlert(null), 8000);
        };

        // User side: their booking was declined
        const handleBookingDeclined = (booking) => {
            // Update the booking status in myBookings list immediately
            dispatch(updateMyBookingStatus({ bookingId: booking._id, booking }));
            setBookingDeclinedAlert(booking);
            setTimeout(() => setBookingDeclinedAlert(null), 8000);
        };

        socket.on("new-booking", handleNewBooking);
        socket.on("booking-accepted", handleBookingAccepted);
        socket.on("booking-declined", handleBookingDeclined);

        return () => {
            socket.off("new-booking", handleNewBooking);
            socket.off("booking-accepted", handleBookingAccepted);
            socket.off("booking-declined", handleBookingDeclined);
        };
    }, [user?._id, dispatch]);

    const dismissNewBooking = useCallback(() => setNewBookingAlert(null), []);
    const dismissAccepted = useCallback(() => setBookingAcceptedAlert(null), []);
    const dismissDeclined = useCallback(() => setBookingDeclinedAlert(null), []);

    return {
        newBookingAlert,
        bookingAcceptedAlert,
        bookingDeclinedAlert,
        dismissNewBooking,
        dismissAccepted,
        dismissDeclined,
    };
};