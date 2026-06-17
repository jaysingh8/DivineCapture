import React from 'react'
import { createBrowserRouter } from 'react-router'
import Register from '../features/auth/page/register'
import Login from '../features/auth/page/Login'
import Profile from '../features/serviceProvider/pages/Profile'
import Portfolio from '../features/serviceProvider/pages/Portfolio'
import Default from '../features/serviceProvider/pages/Default'



export const routes =createBrowserRouter([
    {
        path:"/register",
        element:<Register/>
    },{
        path:"/login",
        element:<Login/>
    },{
        path:"/profile",
        element:<Profile/>
    },{
        path:"/portfolio",
        element:<Portfolio/>
    },{
        path:"/",
        element:<Default/>
    }
])

export default routes
