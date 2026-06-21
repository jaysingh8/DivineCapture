import Router from 'express'
import { profileValidator } from '../validators/getter.validator.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';
import { getAllProfile, getProfile, isActive, portfolio, profile, profileDetail } from '../controllers/getter.controller.js';
import multer from 'multer'


const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

router.post("/profile", authenticateUser, authorizeRoles("getter"), profileValidator, profile)

router.post("/portfolio", authenticateUser, authorizeRoles("getter"), upload.array('images', 3), portfolio)

router.get("/getProfile", authenticateUser, getProfile)

router.get("/", getAllProfile)
router.get("/profile/:id" ,profileDetail)


router.patch("/isActive",authenticateUser ,isActive)

export default router
