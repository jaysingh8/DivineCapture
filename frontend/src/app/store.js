import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/states/auth.slice'
import profileReducer from '../features/serviceProvider/state/profile.slice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        profile:profileReducer
    }
})
