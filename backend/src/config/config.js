import dotenv from "dotenv";

dotenv.config()

if(!process.env.PORT){
    throw new Error("Port is not define")
}
if(!process.env.MONGO_URI){
    throw new Error("Mongo_URI is not define")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not define")
}

if(!process.env.GOOGLE_AUTH_API){
    throw new Error("Google auth api not define")
}

if(!process.env.GOOGLE_AUTH_SECRET){
    throw new Error("Google auth secret not define")
}



export const config = {
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    GOOGLE_AUTH_API : process.env.GOOGLE_AUTH_API,
    GOOGLE_AUTH_SECRET : process.env.GOOGLE_AUTH_SECRET
}