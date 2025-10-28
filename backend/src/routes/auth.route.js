import express from "express"
import { loginValidation, registerValidation } from "../validations/auth.validation.js"
import { validate } from "../middlewares/validation.middleware.js"
import { login, register } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", validate(registerValidation), register)
router.post("/login", validate(loginValidation), login)

export default router