const mongoose = require("mongoose");


const JobPostSchema = new mongoose.Schema({
    role: {
      type: String,
    },
    title: {
      type: String,
    },
    description: String,
    skills: [{
      type:String
    }],
    location: String,
    experience: {
      type: Number,
    
    },
    amount: {
      type: Number,
     
    },
    mode: {
      type: String,
      enum: ["Hybrid", "Remote", "Office"],
      
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    organization: {
      type: String,
     
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs", // Company/Employer reference
     
    },
    postedDate: {
      type: Date,
      default: Date.now, // Automatically sets the date when the job is posted
    },
     application:[{
         type: mongoose.Schema.Types.ObjectId,
              ref: "Application",
      }],
    
  }, { timestamps: true });

const Jobpost = mongoose.model("JobPost", JobPostSchema);

module.exports = Jobpost;
