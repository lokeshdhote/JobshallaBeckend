const jwt = require("jsonwebtoken");
const Errorhandler = require("../Utils/ErrorHandler");
const { catchAsync } = require("./CatchAsync.js");

// Generalized authentication middleware
exports.isAuthenticated = (Model) => {
  return catchAsync(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new Errorhandler("Please log in to access this resource", 401));
    }

    // Extract the token (remove 'Bearer ' from the beginning)
    const token = authHeader.split(" ")[1];

    if (!token || token === "null") {
      return next(new Errorhandler("Please log in to access this resource", 401));
    }

    
  // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Model.findById(decodedData.id);

    if (!req.user) {
      return next(new Errorhandler("User not found", 404));
    }

    next();
  });
};
