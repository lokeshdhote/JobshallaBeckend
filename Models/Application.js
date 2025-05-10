const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  applicantname: {
    type: String,
  },

  applicantemail: {
    type: String,
    match: [  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/  ],
  },

  applicantphonenumber: {
    type: Number,
  },

  resume: {
    type: String, // URL or file path
  },

  skills: [String], // e.g., ["React", "MongoDB"]

  achievements: [String], // e.g., ["Winner - SIH 2024", "Top 5 - XYZ Hackathon"]

  workExperience: [
    {
      company: String,
      role: String,
      duration: String, // e.g., "Jan 2023 - Jun 2023"
      description: String,
    },
  ],

  projects: [
    {
      title: String,
      description: String,
      githubLink: String,
      deployedLink: String,
    },
  ],

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobpost",
  },

  status: {
    type: String,
    enum: ["applied", "under review", "interview", "screening", "rejected", "accepted"],
    default: "applied",
  },

  appliedDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
