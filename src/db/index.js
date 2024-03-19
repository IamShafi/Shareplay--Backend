import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"
import colors from "colors";

const connectToDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(colors.red("MongoDB connection FAILED"), error);
        process.exit(1);
    }
}

export default connectToDatabase
