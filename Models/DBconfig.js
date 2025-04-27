const mongoose = require("mongoose")
exports.dbconnection = async ()=>{
    try{
         mongoose.connect(process.env.MONGODB_URL)
         console.log("Connected to MongoDB");
    }catch(error){
        console.log(error.message);
    }
}

