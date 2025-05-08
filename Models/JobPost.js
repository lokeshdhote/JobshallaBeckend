const mongoose = require("mongoose");


const JobPostSchema = new mongoose.Schema({
    role: {
      type: String,
      required: [true, "Job role is required"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    description: String,
    skills: [String],
    location: String,
    experience: {
      type: Number,
    //   required: [true, "Experience is required"],
    },
    amount: {
      type: Number,
      required: [true, "Salary amount is required"],
    },
    mode: {
      type: String,
      enum: ["Hybrid", "Remote", "Office"],
      required: [true, "Work mode is required"],
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    organization: {
      type: String,
      required: [true, "Organization is required"],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs", // Company/Employer reference
      required: true,
    },
    postedDate: {
      type: Date,
      default: Date.now, // Automatically sets the date when the job is posted
    },
    applications: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student", // Reference to the student applying
          required: true,
        },
        status: {
          type: String,
          enum: ["applied", "under review", "rejected", "accepted"],
          default: "applied", // Default status when a student first applies
        },
        appliedDate: {
          type: Date,
          default: Date.now, // Date when the student applied
        },
      },
    ],
  }, { timestamps: true });
const Jobpost = mongoose.model("JobPost", JobPostSchema);
module.exports = Jobpost;
