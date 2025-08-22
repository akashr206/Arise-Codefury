import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName : "codefury-8"
        });
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to the databasae", error);
    }
};
