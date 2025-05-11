const { catchAsync } = require("../Middleware/CatchAsync");
const Errorhandler = require("../Utils/ErrorHandler");
const jobmodel = require("../Models/JobModel.js");
const JobPost = require("../Models/JobPost.js");
const ErrorHandler = require("../Utils/ErrorHandler");
const Application = require("../Models/Application.js");
const Studuent = require("../Models/StudentModel.js");



exports.home = catchAsync(async (req, res,next) => {
  res.send("hello Students");

});


exports.register= catchAsync(async (req, res,next) => {
  try {
    console.log(req.body);

    const job = await new jobmodel(req.body).save();
  SendToken(job, 200, res, "job");
  } catch (error) {
    next(error);
  }
  });

 
exports.login =catchAsync(async (req, res,next) => {
    const job = await jobmodel.findOne({ email: req.body.email })
      .select("+password")
      .exec();
  
    if (!job) {
      return next(new ErrorHandler("User with this email not found", 404));
    }
  
    const isMatch = await job.comparepassword(req.body.password);
  
    if (!isMatch) {
      return next(new ErrorHandler("Wrong credentials", 401));
    }
  
    SendToken(job, 200, res, "job");
  });

  
exports.loggedin = catchAsync(async (req, res,next) => {
    const job = await jobmodel.findById(req.user.id).exec();
    res.status(200).json({ job, role: "job" });
  
  
  });


exports.signout = catchAsync(async (req, res,next) => {
    res.clearCookie("token");
    res.json({ message: "Signed out successfully" });
  });
  

exports.deleteAccount = catchAsync(async (req, res,next) => {
    try {
      const job = await jobmodel.findOneAndDelete(req.id).exec();
     SendToken(job, 200, res);
    } catch (error) {
      next(error);
    }
  });


exports.Profile = catchAsync(async (req, res,next) => {
    try {
      const job = await jobmodel.findById(req.user.id).exec();
      res.status(200).json({ job });
    } catch (error) {
      next(error);
    }
  });


exports.createjobpost = catchAsync(async (req, res, next) => {
  try {
    const job = await jobmodel.findById(req.user.id).exec();

    if (!job) {
      return res.status(404).json({ message: "Job user not found" });
    }

    const jobpost = await new JobPost({
      ...req.body,
      postedBy: job._id,
      organization: job.organization, // auto-fill from Job model
    }).save();

    job.jobPosts.push(jobpost._id);
    await job.save();

    res.status(201).json({
      message: "Job post created successfully",
      jobpost,
    });

  } catch (error) {
    next(error);
  }
});


exports.delete = catchAsync(async (req, res,next) => {
    try {
      
      const job = await JobPost.findOneAndDelete(req.params.jobpostid);
      res.status(200).json({ job });
    } catch (error) {
      next(error);
    }
  });


exports.alljobpost = catchAsync(async (req, res,next) => {
    try {

         const job = await jobmodel.findById(req.user.id).populate("jobPosts").exec();
         const jobpost = job.jobPosts ;

        res.status(200).json({ jobpost });
    } catch (error) {
      next(error);
    }
  });

  
exports.allapplication = catchAsync(async (req, res,next) => {
    try {

        const application = await Application.findOne(req.params.jobpostid)

        res.status(200).json({ application });
    } catch (error) {
      next(error);
    }
  });

exports.Specificapplication = catchAsync(async (req, res,next) => {
    try {

        const application = await Application.findOne(req.params.applicationid)

        res.status(200).json({ application });
    } catch (error) {
      next(error);
    }
  });

  
exports.filterStudents = catchAsync(async (req, res, next) => {
  const { role, skills, gender, passoutYear } = req.query;

  const filter = {};

  if (gender) filter.gender = gender;

  if (passoutYear) filter.passoutYear = Number(passoutYear);

  // Combine role and skills filtering on verifiedSkills.skill
  const skillConditions = [];

  if (role) {
    skillConditions.push({
      "verifiedSkills.skill": {
        $regex: role,
        $options: "i",
      },
    });
  }

  if (skills) {
    const skillArray = skills.split(",").map((skill) => skill.trim());
    skillConditions.push({
      "verifiedSkills.skill": { $all: skillArray },
    });
  }

  if (skillConditions.length > 0) {
    filter.$and = skillConditions;
  }

  const students = await Studuent.find(filter).select("-password");

  res.status(200).json({
    success: true,
    count: students.length,
    students,
  });
});






