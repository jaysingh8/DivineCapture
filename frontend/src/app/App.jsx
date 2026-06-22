import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router'
import { useSelector } from "react-redux";
import { useAuth } from '../features/auth/hooks/useAuth.js'
import routes from './app.routes.jsx'
import socket from "../socket.js";
import { useBookingSocket } from '../features/booking/hook/useBookingSocket.js';
import BookingRequestPopup from '../features/booking/components/Bookingrequestpopup.jsx';

const App = () => {
  const { handleGetMe } = useAuth()
  const [initialized, setInitialized] = useState(false)

  const user = useSelector((state) => state.auth.user);

  const {
    newBookingAlert,
    bookingAcceptedAlert,
    bookingDeclinedAlert,
    dismissNewBooking,
    dismissAccepted,
    dismissDeclined,
  } = useBookingSocket(user);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await handleGetMe()
      } catch (error) {
        console.log("User not authenticated")
      } finally {
        setInitialized(true)
      }
    }
    initAuth()
  }, [])

  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm animate-pulse">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <RouterProvider router={routes} />

      {/* Provider: new booking request popup */}
      {newBookingAlert && (
        <BookingRequestPopup
          booking={newBookingAlert}
          onDismiss={dismissNewBooking}
        />
      )}

      {/* User: booking accepted toast */}
      {bookingAcceptedAlert && (
        <div className="fixed top-5 right-3 sm:right-5 z-[9999] bg-emerald-600 text-white text-sm font-medium px-4 sm:px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[slideInRight_0.3s_ease-out] left-3 sm:left-auto">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="flex-1">Your booking was accepted!</span>
          <button onClick={dismissAccepted} className="opacity-70 hover:opacity-100 transition-opacity shrink-0">✕</button>
        </div>
      )}

      {/* User: booking declined toast */}
      {bookingDeclinedAlert && (
        <div className="fixed top-5 right-3 sm:right-5 z-[9999] bg-red-500 text-white text-sm font-medium px-4 sm:px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[slideInRight_0.3s_ease-out] left-3 sm:left-auto">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="flex-1">Your booking was declined.</span>
          <button onClick={dismissDeclined} className="opacity-70 hover:opacity-100 transition-opacity shrink-0">✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(80px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>
    </>
  )
}

export default App