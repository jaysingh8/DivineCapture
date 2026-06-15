import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

/*
@registerapi : /auth/api/register

*/
router.post("/register",registerValidator,register)
router.post("/login",loginValidator,login)
router.get("/getMe",authenticateUser,getMe)

export default router