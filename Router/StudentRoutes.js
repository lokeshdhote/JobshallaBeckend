const express = require("express")
 const router = express.Router();

 const studentcontroller = require("../Controllers/Studentcontroller.js");
const { isAuthenticated } = require("../Middleware/Auth.js");
const Studuent = require("../Models/StudentModel.js");


//  home route
router.get("/",isAuthenticated(Studuent),studentcontroller.home);


// register route for student 
router.post("/register",studentcontroller.register);


// Login route for student
 router.post('/login',studentcontroller.login );


// for find Loggedin user 
router.get("/loggedin",isAuthenticated(Studuent),studentcontroller.loggedin);


// Signout route for student
router.get("/signout",isAuthenticated(Studuent),studentcontroller.signout);


// delete route for student 
router.get("/deleteAccount",isAuthenticated(Studuent),studentcontroller.deleteAccount);


// profile route for student 
router.get("/profile",isAuthenticated(Studuent),studentcontroller.Profile);


//Edit profile route for student 
// router.post("/Editprofile",isAuthenticated(Studuent),studentcontroller.editProfile);


// skill test and pass then save in profile
router.post("/skillsave",isAuthenticated(Studuent),studentcontroller.skillsave)


// skill test and fail then remove in profile
router.post("/skillremove",isAuthenticated(Studuent),studentcontroller.skillremove)



// apply the application of job 
router.post("/apply/:jobpostid",isAuthenticated(Studuent),studentcontroller.applyApplication);



// see all the application of stucent 
router.get("/allapplication",isAuthenticated(Studuent),studentcontroller.allapplication)



// see the  specific or selected application of stucent 
router.get("application/:applicationtid",isAuthenticated(Studuent),studentcontroller.getApplicationById);



// withdraw the  specific or selected application of stucent 
router.put("/withdraw/:applicationid",isAuthenticated(Studuent),studentcontroller.withdrawApplication);



router.get("/filter",isAuthenticated(Studuent),studentcontroller.filter);




 module.exports = router;