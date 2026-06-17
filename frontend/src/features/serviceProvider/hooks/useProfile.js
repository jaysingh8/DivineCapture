import  { setLoading,setProfile } from "../state/profile.slice.js"
import { profile, portfolio  } from "../services/profile.api.js"
import { useDispatch } from "react-redux"


export const useProfile=()=>{
    const dispatch = useDispatch()

    async function handleProfile({profession,bio,experience,city,state,address,equipments,profileImage}){

        try {
            dispatch(setLoading(true))
            const data= await profile({profession,bio,experience,city,state,address,equipments,profileImage})
            dispatch(setProfile(data.data))
            return data.data
        } catch (error) {
             console.error("Profile creation failed", error);
            throw error;
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handlePortfolio({images}){

        try {
            dispatch(setLoading(true))
            const data = await portfolio({images})
            dispatch(setProfile(data.data))
            return data.data
        } catch (error) {
            console.error("Portfolio upload failed", error);
            throw error;
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {handleProfile, handlePortfolio}

}
