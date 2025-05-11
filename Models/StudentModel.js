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
  linkdein:{
    type:String,
  },
  github:{
    type:String,
  },
  portfolio:{
    type:String,
  },
resume:{
  type:String,
},
introvideo:{
  type:String,
},
role:{
  type:String
},
  application:[{
     type: mongoose.Schema.Types.ObjectId,
          ref: "Application",
  }],
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
 passoutYear: {
    type: Number,
  },
  education: [
    {
      institution: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      grade: { type: String },
    }
  ],

  experience: [
    {
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      description: { type: String, maxlength: 1000 },
      location: { type: String },
    }
  ],

  projects: [
    {
      title: { type: String, required: true },
      description: { type: String, maxlength: 500 },
      technologies: [String],
      link: { type: String },
      github: { type: String },
    }
  ],

  achievements: [
    {
      title: { type: String, required: true },
    
    }
  ],


  // New unified applications tracking

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