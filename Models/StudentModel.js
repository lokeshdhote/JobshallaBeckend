const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Name must have at least 2 characters"],
    maxlength: [20, "Name must be less than 20 characters"],
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
  password: {
    type: String,
    select: false,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [16, "Password must be at most 16 characters"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  dateOfBirth: {
    type: Date,
  },
  verifiedSkills: [
    {
      skill: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
  ],

  // New unified applications tracking
  appliedPosts: [
    {
      postType: {
        type: String,
        enum: ["JobPost", "InternshipPost"],
        required: true,
      },
      post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "appliedPosts.postType",
      },
      applicationStatus: {
        type: String,
        enum: ["applied", "under review", "rejected", "accepted"],
        default: "applied",
      },
      appliedDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });



// Pre-save middleware to hash password
StudentSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  });
  
  // Method to compare passwords
  StudentSchema.methods.comparepassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  // Method to generate JWT token
  StudentSchema.methods.getjwttoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };



const Studuent = mongoose.model("Student",StudentSchema);
module.exports= Studuent ;