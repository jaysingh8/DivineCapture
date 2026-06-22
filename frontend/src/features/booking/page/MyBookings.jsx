import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useBooking } from "../hook/useBooking";
import CountdownTimer from "../components/CountdownTimer";

const STATUS_COLORS = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
    declined: "bg-red-100 text-red-700 border-red-200",
    expired: "bg-gray-100 text-gray-500 border-gray-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
};

const MyBookings = () => {
    const { handleGetMyBookings } = useBooking();
    // myBookings is an array (set via setMyBookings(data.bookings))
    const { myBookings, loading } = useSelector((state) => state.booking);

    useEffect(() => {
        handleGetMyBookings();
    }, []);

    if (loading && myBookings.length === 0) {
        return (
            <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-500 font-medium text-sm">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-500 text-sm mt-1">Track all your photography bookings</p>
                </div>

                {myBookings.length === 0 ? (
                    <div className="text-center bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h2>
                        <p className="text-gray-500 text-sm">When you book a photographer, your bookings will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myBookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                            {booking.provider?.user?.fullname?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                                                {booking.provider?.user?.fullname || "Photographer"}
                                            </h3>
                                            <p className="text-[13px] text-gray-500 capitalize">
                                                {booking.bookingType}
                                            </p>
                                            <p className="text-[12px] text-gray-400 mt-0.5">
                                                Booked{" "}
                                                {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                                                STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                        {/* Show live countdown only for pending bookings */}
                                        {booking.status === "pending" && booking.expiresAt && (
                                            <CountdownTimer expiresAt={booking.expiresAt} />
                                        )}
                                    </div>
                                </div>
                                {booking.provider?.city && (
                                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-[12px] text-gray-500">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {booking.provider.city}
                                    </div>
                                )}
                                {/* Show acceptance info */}
                                {booking.status === "accepted" && (
                                    <div className="mt-3 pt-3 border-t border-emerald-50 flex items-center gap-2 text-[12px] text-emerald-700 font-medium">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Your booking was accepted! The provider will be in touch soon.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;