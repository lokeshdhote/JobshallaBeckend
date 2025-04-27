// It catch the error and throw to next(err)


exports.catchAsync = (func)=>(req,res,next)=>{
 
    Promise.resolve(func(req,res,next)).catch(next);
};