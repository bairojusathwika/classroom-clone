const express = require("express");
const router = express.Router();


router.get("/",function(req,res){
    res.sendFile("student.html",{ root : "./public/htmlfiles"});
})

router.get("/profile",function(req,res){
    res.sendFile(  "profile.html", {root :  "./public/htmlfiles"})
})

router.get("/studenthomepage",function(req,res){
    res.sendFile("studenthomepage.html" , {root : "./public/htmlfiles"})
})

router.get("/teacherhomepage",function(req,res){
    res.sendFile("teacherhomepage.html" ,{root : "./public/htmlfiles"})
})


module.exports = router;