require("dotenv").config({path:"./.env"})

const express = require("express");
const session = require("express-session")
const {generatedError} = require("./Middleware/Error.js")
const {catchAsync} = require("./Middleware/CatchAsync.js")
const ErrorHandler = require("./Utils/ErrorHandler.js")

const app = express(); // app is give by express and the appp is provide some tools 
// " app is  a brain of server " 

const logger = require("morgan"); // morgan is a logger for HTTP requests

const cookieParser = require("cookie-parser"); // parse cookies sent with HTTP requests and populate req.cookies


require("./models/DBconfig.js").dbconnection();

app.use(express.json()); // send the json data by req.body


app.use(express.urlencoded({ extended: false })); //the post form or data can access by this 

;

app.use(cookieParser());

app.use(logger("tiny"));



// app use this  -> / routes to as a prefix in index route
// app.use("/",require("./Router/Indexroute.js"));
const Indexroute = require("./Router/Indexroute.js")
app.use("/",Indexroute)
app.use("/Student",require("./Router/StudentRoutes.js"));
app.use("/Job",require("./Router/JobRoutes.js"));


// With this
// app.all("*", (req, res, next) => {
//   next(new ErrorHandler(`Requested URL NOT Found: ${req.url}`, 404));
// });   

app.use(generatedError);

// app listen the port and run on it !
app.listen(process.env.PORT ,()=>{
    console.log(`server running on ${process.env.PORT } port`)
})
