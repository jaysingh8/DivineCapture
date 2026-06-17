import Router from 'express'
import { profileValidator } from '../validators/getter.validator.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { portfolio, profile } from '../controllers/getter.controller.js';
import multer from 'multer'


const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

router.post("/profile",authenticateUser,profileValidator ,profile)

router.post("/portfolio",authenticateUser, upload.array('images', 3),portfolio)



export default router  