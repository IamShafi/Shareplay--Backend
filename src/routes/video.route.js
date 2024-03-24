import express from "express";
import { addVideo, addView, getByTag, getVideo, random, search, sub, trend } from "../controllers/video.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

//create a video
router.post("/", verifyJWT, addVideo)
router.put("/:id", verifyToken, addVideo)
router.delete("/:id", verifyToken, addVideo)
router.get("/find/:id", getVideo)
router.put("/view/:id", addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/sub",verifyToken, sub)
router.get("/tags", getByTag)
router.get("/search", search)

export default router;
