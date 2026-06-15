import express, { urlencoded } from "express";
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import passport from 'passport'
import { Strategy as GoogleStrategy} from 'passport-google-oauth20'
import cors from "cors"
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true

}))


/*
Google auth
*/


/*
Api 
*/
app.use("/api/auth",authRouter)

export default app;