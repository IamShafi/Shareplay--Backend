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


//error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  });

// routes imports

// routes declaration
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/videos", videoRoutes);
// app.use("/api/comments", commentRoutes);

export {app}