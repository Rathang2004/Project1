var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Rathang Pandit", css: ['index1.css'], js: ['index.js']});
});
router.get("/login",function (req,res){
  res.render('login', {title: "Login Page", css: ['login1.css']});
});
router.get("/registration",function (req,res){
  res.render('registration', {title: "Registration Page", css: ['registration1.css'], js: ['registration.js']});
});
router.get("/postvideo",function (req,res){
  res.render('postvideo', {title: "Post Video Page", css: ['postvideo1.css']});
});
router.get("/viewpost",function (req,res){
  res.render('viewpost', {title: "View Post Page", css: ['viewpost1.css']});
});
module.exports = router;
