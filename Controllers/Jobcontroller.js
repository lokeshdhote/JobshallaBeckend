const { catchAsync } = require("../Middleware/CatchAsync");
const Errorhandler = require("../Utils/ErrorHandler");
const jobmodel = require("../Models/JobModel.js");
const ErrorHandler = require("../Utils/ErrorHandler");


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

