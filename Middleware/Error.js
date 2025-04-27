//It generted the error on status 

exports.generatedError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; // ✅ Fix the casing
  
    // console.log("generatedError");
  
    if (
      err.name === "MongoServerError" &&
      err.message.includes("E11000 duplicate key ")
    ) {
      err.message = "Email or password already exists";
    }
  
    res.status(statusCode).json({
      message: err.message,
      errName: err.name,
    });
  };
  
  