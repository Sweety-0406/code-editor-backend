
const mongoose = require("mongoose")

const connectDB = async ()=>{ 
   try {
    const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}`)
    console.log(`app is running on port ${connectionInstance.connection.host}`)
 
   } catch (error) {
    console.log(error);
    process.exit(1)
   }
}

module.exports = connectDB