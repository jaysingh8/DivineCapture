import { createSlice } from "@reduxjs/toolkit";


const profileSlice = createSlice({
    name:"profile",
    initialState:{
        profile:null,
        loading:false
    },
    reducers:{
        setProfile:(state,action)=>{
            state.profile = action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        }
    }
})


export const {setLoading,setProfile}= profileSlice.actions
export default profileSlice.reducer