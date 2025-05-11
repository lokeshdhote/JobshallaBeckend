const { catchAsync } = require("../Middleware/CatchAsync");
const Errorhandler = require("../Utils/ErrorHandler");
const studentmodel = require("../Models/StudentModel");
const { SendToken } = require("../Utils/SendToken");
const ErrorHandler = require("../Utils/ErrorHandler");
const Application = require("../Models/Application");
const Jobpost = require("../Models/JobPost");


exports.home = catchAsync(async (req, res,next) => {
    res.send("hello Students");

  });
  

  exports.register= catchAsync(async (req, res,next) => {
    try {
      console.log(req.body);
  
      const student = await new studentmodel(req.body).save();
    SendToken(student, 200, res, "student");
      // console.log(student);
    } catch (error) {
      next(error);
    }
    });

   
    exports.login =catchAsync(async (req, res,next) => {
      const student = await studentmodel.findOne({ email: req.body.email })
        .select("+password")
        .exec();
    
      if (!student) {
        return next(new ErrorHandler("User with this email not found", 404));
      }
    
      const isMatch = await student.comparepassword(req.body.password);
    
      if (!isMatch) {
        return next(new ErrorHandler("Wrong credentials", 401));
      }
    
      SendToken(student, 200, res, "student");
    });

    
    exports.loggedin = catchAsync(async (req, res,next) => {
      const Student = await studentmodel.findById(req.user.id).exec();
      res.status(200).json({ Student, role: "Student" });
    
    
    });


    exports.signout = catchAsync(async (req, res,next) => {
      res.clearCookie("token");
      res.json({ message: "Signed out successfully" });
    });
    

    exports.deleteAccount = catchAsync(async (req, res,next) => {
      try {
        const Student = await studentmodel.findOneAndDelete(req.id).exec();
       SendToken(Student, 200, res);
      } catch (error) {
        next(error);
      }
    });

    exports.Profile = catchAsync(async (req, res,next) => {
      try {
        const Student = await studentmodel.findById(req.user.id).exec();
        res.status(200).json({ Student });
      } catch (error) {
        next(error);
      }
    });


exports.skillsave  = catchAsync(async (req, res,next) => {
  const { skill } = req.body;

  // Validate that skill is provided
  if (!skill) {
    return next(new ErrorHandler("Skill name is required", 400));
  }

  // Find the student by the logged-in user (use req.user which was set in the auth middleware)
  const student = await studentmodel.findById(req.user.id);

  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  // Check if the skill already exists in the verifiedSkills array
  const existingSkill = student.verifiedSkills.find(
    (s) => s.skill.toLowerCase() === skill.toLowerCase()
  );

  if (existingSkill) {
    // If the skill exists, update the 'verified' field to true
    existingSkill.verified = true;
    await student.save();
    return res.status(200).json({
      success: true,
      message: "Skill updated and verified successfully",
      student,
    });
  } else {
    // If the skill doesn't exist, create a new skill and add it to the array
    student.verifiedSkills.push({ skill, verified: true });
    await student.save();
    return res.status(200).json({
      success: true,
      message: "New skill added and verified successfully",
      student,
    });
  }
});


exports.skillremove  = catchAsync(async (req, res,next) => {
  const { skill } = req.body;

  // Validate that skill is provided
  if (!skill) {
    return next(new ErrorHandler("Skill name is required", 400));
  }

  // Find the student by the logged-in user (use req.user which was set in the auth middleware)
  const student = await studentmodel.findById(req.user.id);

  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  // Check if the skill exists in the verifiedSkills array
  // const skillIndex = student.verifiedSkills.findIndex(
  //   (s) => s.skill.toLowerCase() === skill.toLowerCase()
  // );

  // if (skillIndex === -1) {
  //   return next(new ErrorHandler("Skill not found in your profile", 404));
  // }

  // Remove the skill from the verifiedSkills array
  student.verifiedSkills.splice(skillIndex, 1);

  // Save the updated student document
  await student.save();

  return res.status(200).json({
    success: true,
    message: "Skill removed successfully",
    student,
  });
});


// Apply for a job
exports.applyApplication = async (req, res) => {
  try {
    const studentId = req.user._id;
    const jobpostId = req.params.jobpostid;

    const existingApp = await Application.findOne({ student: studentId, post: jobpostId });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied for this job post." });
    }

    const student = await studentmodel.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const job = await Jobpost.findById(jobpostId);
    if (!job) return res.status(404).json({ message: "Job post not found" });

    const {
      resume,
      skills,
      achievements,
      workExperience,
      projects,
      applicantphonenumber,
    } = req.body;

    const application = await Application.create({
      applicantname: student.name,
      applicantemail: student.email,
      applicantphonenumber,
      resume,
      skills,
      achievements,
      workExperience,
      projects,
      student: studentId,
      post: jobpostId,
    });

 
    return res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    return res.status(500).json({ message: "Error applying", error: error.message });
  }
};


// Get all applications for the logged-in student
exports.allapplication = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("post", "title company")
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};


// Get application for a specific job post
exports.getApplicationById = async (req, res) => {
  try {
    const studentId = req.user._id;
    const jobpostId = req.params.jobpostid;

    const application = await Application.findOne(req.params.applicationtid);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ application });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch application", error: error.message });
  }
};


// Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const studentId = req.user._id;
    const jobpostId = req.params.jobpostid;

    const application = await Application.findOneAndDelete(req.params.applicationtid);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }



    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to withdraw application", error: error.message });
  }
};


exports.filter = async (req, res) => {
  try {
    const { mode, location, role, minExperience, maxExperience, minAmount, maxAmount } = req.query;

    const filter = {};

    if (mode) {
      filter.mode = mode; // "Remote", "Office", "Hybrid"
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" }; // case-insensitive match
    }

    if (role) {
      filter.role = { $regex: role, $options: "i" };
    }

    if (minExperience || maxExperience) {
      filter.experience = {};
      if (minExperience) filter.experience.$gte = Number(minExperience);
      if (maxExperience) filter.experience.$lte = Number(maxExperience);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const jobPosts = await Jobpost.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: jobPosts.length, jobPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
