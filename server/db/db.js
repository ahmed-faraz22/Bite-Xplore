import mongoose from 'mongoose';
import { DB_NAME } from '../src/constant.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME,
        });
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;