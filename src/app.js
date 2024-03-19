import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Enable parsing of JSON data in the request body
app.use(express.json({limit: "16kb"}))
// Enable parsing of URL-encoded data in the request body
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// Serve static files from the "public" directory
app.use(express.static("public"))
// Parse cookies from incoming requests
app.use(cookieParser())


// routes imports

// routes declaration

export {app}