const mongoose = require('mongoose')
const {ApiError} = require("../utils/ApiError")
const dbUrl = process.env.MONGODB_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}
 const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
    }
    catch(error){
      throw new ApiError(500," something went wrong");
    }
};
module.exports= connectDB;
    