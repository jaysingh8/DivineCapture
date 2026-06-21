import { setAllProfiles, setLoading, setProfile } from "../state/profile.slice.js"
import { profile, portfolio, getProfile, getAllProfile, profileDetails, isActive } from "../services/profile.api.js"
import { useDispatch } from "react-redux"


export const useProfile = () => {
    const dispatch = useDispatch()

    async function handleProfile({ profession, bio, experience, city, state, address, equipments, profileImage }) {

        try {
            dispatch(setLoading(true))
            const data = await profile({ profession, bio, experience, city, state, address, equipments, profileImage })
            dispatch(setProfile(data.data))
            return data.data
        } catch (error) {
            console.error("Profile creation failed", error);
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handlePortfolio({ images }) {

        try {
            dispatch(setLoading(true))
            const data = await portfolio({ images })
            dispatch(setProfile(data.data))
            return data.data
        } catch (error) {
            console.error("Portfolio upload failed", error);
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetProfile() {
        try {
            dispatch(setLoading(true))
            const data = await getProfile()
            dispatch(setProfile(data.userDetail))
            return data.userDetail
        } catch (error) {
            console.error("Get profile failed", error)
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetAllProfile() {
        try {
            dispatch(setLoading(true))
            const data = await getAllProfile()
            dispatch(setAllProfiles(data.profile))
            return data.profile
        } catch (error) {
            console.error("Get profile failed", error)
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleDetail(profileId) {
        try {
            const data = await profileDetails(profileId)
           return data.profile
            
        } catch (error) {
            
        }
    }

    async function handleIsActive() {
        try {
            const data = await isActive()
            // Update the profile status in redux store
            dispatch(setProfile({ ...data, status: data.status }))
            // Re-fetch the full profile to keep state in sync
            await handleGetProfile()
            return data
        } catch (error) {
            console.error("Toggle status failed", error)
            throw error
        }
    }

    return { handleProfile, handlePortfolio, handleGetProfile ,handleGetAllProfile ,handleDetail, handleIsActive}

}
