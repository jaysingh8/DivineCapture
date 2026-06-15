import React from 'react'
import { createBrowserRouter } from 'react-router'
import Register from '../features/auth/page/register'
import Login from '../features/auth/page/Login'
import Detailed from '../features/detials/Detailed'


export const routes =createBrowserRouter([
    {
        path:"/register",
        element:<Register/>
    },{
        path:"/login",
        element:<Login/>
    },{
        path:"/",
        element:<Detailed/>
    }
])

export default routes