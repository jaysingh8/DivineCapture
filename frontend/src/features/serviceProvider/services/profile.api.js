import axios from "axios";

const authApiInstance = axios.create({
  baseURL: `http://localhost:3000/api/`,
  withCredentials: true,
});


export async function profile({profession,bio,experience,city,state,address,equipments,profileImage}) {
    const response = await authApiInstance.post("/profile",{profession,bio,experience,city,state,address,equipments,profileImage})
    return response.data
}

export async function portfolio({images}) {
    const formData = new FormData();
    
    images.forEach((image) => {
        formData.append('images', image);
    });

    const response = await authApiInstance.post("/portfolio", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

export default authApiInstance