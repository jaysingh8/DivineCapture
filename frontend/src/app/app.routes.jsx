import React from 'react'
import { createBrowserRouter, Outlet } from 'react-router'
import Register from '../features/auth/page/register'
import Login from '../features/auth/page/Login'
import Profile from '../features/serviceProvider/pages/Profile'
import Portfolio from '../features/serviceProvider/pages/Portfolio'
import Default from '../features/serviceProvider/pages/Default'
import BrowseProfiles from '../features/serviceProvider/pages/BrowseProfiles'
import MyProfile from '../features/serviceProvider/pages/MyProfile'
import PhotographerDashboard from '../features/serviceProvider/pages/PhotographerDashboard'
import AllPhotograherDetails from '../features/serviceProvider/pages/AllPhotograherDetails'
import ServiceProviderHome from '../features/serviceProvider/pages/ServiceProviderHome'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import AppLayout from './AppLayout'


export const routes = createBrowserRouter([
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    {
        element:<AppLayout />,
        children:[
    { path: "/", element: <Default /> },
    { path: "/profile", element: (
    <ProtectedRoute role="getter">
        <Profile />
    </ProtectedRoute>
    ) },
    { path: "/browse/:id", element: (
        <ProtectedRoute role="user">
            <BrowseProfiles />
        </ProtectedRoute>
    
 )},
    { path: "/portfolio", element: (
        <ProtectedRoute role="getter">
            <Portfolio /> 
        </ProtectedRoute>
    
)},
    { path: "/dashboard/profile", element: <MyProfile /> },
    { path: "/dashboard", element:
        (
             <ProtectedRoute role="getter">
                <PhotographerDashboard />
             </ProtectedRoute>
             

        ) },
    {
        path: "/findProfile", element: (
            <ProtectedRoute role="user">
                <AllPhotograherDetails />
            </ProtectedRoute>
        )
    },
    {
        path: "/serviceProviderHome",
        element: (
            <ProtectedRoute role="getter">
                <ServiceProviderHome />
            </ProtectedRoute>
        )
 
    }
]
}
    
])

export default routes