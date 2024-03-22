import express from "express";
import { googleAuth, signin, signup, logout } from "../controllers/auth.controller.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

//SIGN IN
router.post("/signin", signin)
router.post("/logout", logout)

//GOOGLE AUTH
router.post("/google", googleAuth)

export default router;
