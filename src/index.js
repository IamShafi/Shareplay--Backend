import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path: "./.env"
});

// Define the port for the server to listen on, using the provided port or default to 8000
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️  Server is running at port : ${process.env.PORT} `.bgMagenta.underline);
    })
})
.catch((err) => {
    console.log(colors.red("MongoDB connection FAILED"), err);
})