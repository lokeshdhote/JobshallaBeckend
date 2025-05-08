const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JobSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Name must have at least 2 characters"],
    maxlength: [20, "Name must be less than 20 characters"],
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  organization: {
    type: String,
    required: [true, "Organization is required"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [16, "Password must be at most 16 characters"],
  },
  resetPasswordToken: {
    type: String,
    default: "0",
  },
  linkedin: {
    type: String,
  },
  contactNumber: {
    type: String,
   
  },
  website: {
    type: String,
  },
  jobPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
    },
  ],
  internshipPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternshipPost",
    },
  ],
}, { timestamps: true });

// Pre-save middleware to hash password
JobSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

// Method to compare passwords
JobSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Method to generate JWT token
JobSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Corrected model name
const Job = mongoose.model("Jobs", JobSchema);
module.exports = Job;
