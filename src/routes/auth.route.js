import express from "express";
import {
  googleAuth,
  signin,
  signup,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/refresh-token").post(refreshAccessToken);
//CREATE A USER
router.post("/signup", signup);
//SIGN IN
router.post("/signin", signin);
// SECURED 
router.route("/logout").post(verifyJWT, logout);
//GOOGLE AUTH
router.post("/google", googleAuth);

export default router;
