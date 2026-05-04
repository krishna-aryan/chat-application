import mongoose from "mongoose";

// function to connect to the database
export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not set in environment variables");
        }

        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err.message);
        });

        // If URI already includes a database name, use as-is; otherwise append one.
        const hasDbName = /mongodb(\+srv)?:\/\/.+\/.+/.test(mongoUri);
        const finalUri = hasDbName ? mongoUri : `${mongoUri}/chat-app`;

        await mongoose.connect(finalUri, { serverSelectionTimeoutMS: 10000 });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};
