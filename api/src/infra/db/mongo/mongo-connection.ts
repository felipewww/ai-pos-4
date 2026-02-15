import mongoose from 'mongoose';

export class MongoConnection {
    private static instance: MongoConnection;
    private isConnected: boolean = false;

    private constructor() {}

    static getInstance(): MongoConnection {
        if (!MongoConnection.instance) {
            MongoConnection.instance = new MongoConnection();
        }

        return MongoConnection.instance;
    }

    async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('MongoDB already connected'.yellow);
            return;
        }

        try {
            const mongoUri = process.env.MONGO_HOST;
            console.log(`Connecting to MongoDB ${mongoUri}...`.cyan);
            // const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/transcribed';

            // await mongoose.connect('mongodb://comprehend-mongodb:27017', {
            await mongoose.connect(process.env.MONGO_HOST, {

                user: process.env.MONGO_USER,
                pass: process.env.MONGO_PASS,
                // dbName: process.env.MONGO_DB,
                autoCreate: true
            });

            this.isConnected = true;
            console.log('MongoDB connected successfully'.green.bold);

            mongoose.connection.on('error', (error) => {
                console.error('MongoDB connection error:'.red, error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected'.yellow);
                this.isConnected = false;
            });

        } catch (error) {
            console.error('Failed to connect to MongoDB:'.red, error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        await mongoose.disconnect();
        this.isConnected = false;
        console.log('MongoDB disconnected'.yellow);
    }

    getConnection() {
        return mongoose.connection;
    }
}

export const mongoConnection = MongoConnection.getInstance();
