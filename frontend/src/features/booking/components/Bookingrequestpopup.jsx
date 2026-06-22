import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useBooking } from "../hook/useBooking";
import CountdownTimer from "./CountdownTimer";

const BookingRequestPopup = ({ booking, onDismiss }) => {
    const navigate = useNavigate();
    const { handleAcceptBooking, handleDeclineBooking } = useBooking();
    const [actionLoading, setActionLoading] = useState(null); // "accept" | "decline" | null
    const [actionDone, setActionDone] = useState(null); // "accepted" | "declined" | null

    // Auto-dismiss after 60 seconds if no action taken
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!actionDone) onDismiss();
        }, 60000);
        return () => clearTimeout(timer);
    }, [actionDone]);

    const handleAccept = async () => {
        setActionLoading("accept");
        try {
            await handleAcceptBooking(booking._id);
            setActionDone("accepted");
            setTimeout(onDismiss, 2000);
        } catch {
            setActionLoading(null);
        }
    };

    const handleDecline = async () => {
        setActionLoading("decline");
        try {
            await handleDeclineBooking(booking._id);
            setActionDone("declined");
            setTimeout(onDismiss, 1500);
        } catch {
            setActionLoading(null);
        }
    };

    const clientName = booking?.user?.fullname || "A client";
    const bookingType = booking?.bookingType || "photography";

    return (
        <div className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[9999] w-[calc(100%-24px)] sm:w-[340px] animate-[slideInRight_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

                {/* Colored top bar */}
                <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">
                            New Booking Request
                        </span>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 pb-4">
                    {actionDone ? (
                        /* Post-action confirmation */
                        <div className={`flex flex-col items-center py-4 gap-2 ${
                            actionDone === "accepted" ? "text-emerald-600" : "text-gray-500"
                        }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                actionDone === "accepted" ? "bg-emerald-100" : "bg-gray-100"
                            }`}>
                                {actionDone === "accepted" ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <p className="text-[13px] font-semibold">
                                {actionDone === "accepted" ? "Booking Accepted!" : "Booking Declined"}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Client info */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-base shrink-0">
                                    {clientName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[14px] font-semibold text-gray-900 truncate">{clientName}</p>
                                    <p className="text-[12px] text-gray-500 capitalize">{bookingType} booking</p>
                                    {booking?.user?.email && (
                                        <p className="text-[11px] text-gray-400 truncate">{booking.user.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Expiry countdown */}
                            <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4">
                                <span className="text-[11px] text-amber-700 font-medium">Expires in</span>
                                {booking?.expiresAt ? (
                                    <CountdownTimer expiresAt={booking.expiresAt} onExpired={onDismiss} />
                                ) : (
                                    <span className="text-[11px] text-amber-500 font-medium">15:00</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDecline}
                                    disabled={!!actionLoading}
                                    className="flex-1 h-[38px] text-[12px] font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    {actionLoading === "decline" ? (
                                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    Decline
                                </button>
                                <button
                                    onClick={handleAccept}
                                    disabled={!!actionLoading}
                                    className="flex-1 h-[38px] text-[12px] font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-md hover:shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    {actionLoading === "accept" ? (
                                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    Accept
                                </button>
                            </div>

                            {/* View all link */}
                            <button
                                onClick={() => { navigate("/provider-bookings"); onDismiss(); }}
                                className="w-full mt-2 text-[11px] text-gray-400 hover:text-blue-500 transition-colors py-1"
                            >
                                View all booking requests →
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100%) scale(0.95); }
                    to   { opacity: 1; transform: translateX(0)      scale(1);    }
                }
            `}</style>
        </div>
    );
};

export default BookingRequestPopup;