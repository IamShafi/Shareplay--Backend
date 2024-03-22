import { createError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, _, next) => {
    try{
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "")
        if(!token) return next(createError(401, "You are not authenticated!"))
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?.id)
        if(!user) return next(createError(404, "User not found!"))
        req.user = user
        next()
    }
    catch(err){
        throw new Error(err)
    }
}