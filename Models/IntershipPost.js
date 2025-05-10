const mongoose = require("mongoose");

const InternshipPostSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, "Internship role is required"],
  },
  title: {
    type: String,
    required: [true, "Internship title is required"],
  },
  description: String,
  skills: [String],
  location: String,
  duration: {
    type: String, // e.g., "3 months", "6 weeks"
    required: [true, "Duration is required"],
  },
  stipend: {
    type: String, // Use string if stipend can be "Unpaid", "₹5000/month", etc.
    required: [true, "Stipend is required"],
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
    ref: "Jobs", // Employer reference
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true });


const Internshippost = mongoose.model("InternshipPost", InternshipPostSchema);
module.exports = Internshippost;
 

