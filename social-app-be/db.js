// db.js (MongoDB connection setup)
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s if server selection fails
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the application if unable to connect
    }
};

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from DB");
});

module.exports = connectDB;