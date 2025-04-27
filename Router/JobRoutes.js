const express = require("express")
 const router = express.Router();

 const jobcontroller = require("../Controllers/Jobcontroller.js");
const Job = require("../Models/JobModel.js");
const { isAuthenticated } = require("../Middleware/Auth.js");

//  home route
router.get("/",isAuthenticated(Job),jobcontroller.home)

// register route for student 
router.post("/register",jobcontroller.register)

 // Login route for student
 router.post('/login',jobcontroller.login );


 // for find Loggedin user 
 router.get("/loggedin",isAuthenticated(Job),jobcontroller.loggedin);
 

// Signout route for student
router.get("/signout",isAuthenticated(Job),jobcontroller.signout)


// delete route for student 
router.get("/deleteAccount",isAuthenticated(Job),jobcontroller.deleteAccount)


// profile route for student 
router.get("/profile",isAuthenticated(Job),jobcontroller.Profile)


//Edit profile route for student 
// router.post("/Editprofile",isAuthenticated(Job),jobcontroller.editProfile)









 module.exports = router;