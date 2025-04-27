const { catchAsync } = require("../Middleware/CatchAsync");
const Errorhandler = require("../Utils/ErrorHandler");
const studentmodel = require("../Models/StudentModel");
const { SendToken } = require("../Utils/SendToken");
const ErrorHandler = require("../Utils/ErrorHandler");


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

    



