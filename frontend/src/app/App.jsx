import React from 'react'
import { RouterProvider } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { useEffect } from 'react'
import routes from './app.routes.jsx'

const App = () => {
  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  return <RouterProvider router={routes} />
}

export default App
