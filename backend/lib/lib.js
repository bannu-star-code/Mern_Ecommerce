import mongoose from "mongoose";

export const connectDB = async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            console.log(`Attempting MongoDB connection (attempt ${retries + 1}/${maxRetries})...`);
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                retryWrites: true,
            });
            console.log(`✓ Connection established to MongoDB: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            retries++;
            console.error(`✗ MongoDB connection failed:`, error.message);
            
            if (retries < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, retries), 10000);
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("✗ Max retries exceeded. Check your MongoDB Atlas:");
                console.error("  - Verify cluster is running");
                console.error("  - Check IP whitelist: https://cloud.mongodb.com/v2");
                console.error("  - Verify MONGO_URI in .env file");
                process.exit(1);
            }
        }
    }
};