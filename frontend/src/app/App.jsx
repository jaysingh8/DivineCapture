import React from 'react'
import { RouterProvider } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { useEffect, useState } from 'react'
import routes from './app.routes.jsx'

const App = () => {
  const { handleGetMe } = useAuth()
  const [initialized, setInitialized] = useState(false)

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

  return <RouterProvider router={routes} />
}

export default App
