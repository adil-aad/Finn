import mongoose from "mongoose"

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...')
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'Finn',
        })
        
        console.log('✓ Database connected successfully')
        console.log('Connected to:', conn.connection.host)
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
        setTimeout(() => process.exit(1), 1000)
    }
}

export default connectDB