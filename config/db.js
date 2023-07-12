const mongoose = require("mongoose")

// Database
const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
            // useFindAndModify: false,
        })
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
    } catch (err) {
        console.error(err);
        process.exit(1)
    }
}

module.exports = connectDB