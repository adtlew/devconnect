const mongoose = require ('mongoose');
const config = require ('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        });
        console.log("Database connected...");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;