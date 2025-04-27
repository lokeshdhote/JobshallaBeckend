const { catchAsync } = require("../Middleware/CatchAsync");
const Errorhandler = require("../Utils/ErrorHandler");

exports.home = catchAsync(async (req, res,next) => {
    res.send("hello");

  });

