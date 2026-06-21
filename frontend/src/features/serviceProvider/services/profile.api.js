import axios from "axios";

const authApiInstance = axios.create({
  baseURL: `http://localhost:3000/api/`,
  withCredentials: true,
});


export async function profile({profession,bio,experience,city,state,address,equipments,profileImage}) {
    const response = await authApiInstance.post("/profile",{profession,bio,experience,city,state,address,equipments,profileImage})
    return response.data
}

export async function portfolio(formData) {
    const response = await authApiInstance.post("/portfolio", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

export async function getProfile() {
    const response = await authApiInstance.get("/getProfile")
    return response.data
    
}

export async function getAllProfile() {
     const response = await authApiInstance.get("/")
     return response.data
}

export async function profileDetails(profileId){
    const response = await authApiInstance.get(`/profile/${profileId}`)
    return response.data
}

export async function isActive(){
    const response = await authApiInstance.patch("/isActive")
    return response.data
}

export default authApiInstance
