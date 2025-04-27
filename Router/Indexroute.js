const express = require("express")
 const router = express.Router();
 
 const indexcontroller = require("../Controllers/Indexcontroller.js")

//  home route
router.get("/",indexcontroller.home)





 module.exports = router;