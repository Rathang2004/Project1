var express = require('express');
const {isLoggedIn} = require("../middleware/auth");
const {getRecentPosts} = require("../middleware/posts");
const db = require("../conf/database");
var router = express.Router();

/* GET home page. */
router.get('/', getRecentPosts,async function(req, res, next)
{
  res.render('index', { title: 'CSC 317 App', name:"Rathang Pandit", css:["index1.css"], js:['index.js']});
});
router.get("/login",function (req,res){
  res.render('login', {title: "Login Page", css: ['login1.css']});
});
router.get("/registration",function (req,res){
  res.render('registration', {title: "Registration Page", css:["registration1.css"], js:["registration.js"]});
});
router.get("/postvideo", isLoggedIn,function (req,res){
  res.render('postvideo', {title: "Post Video Page", css: ['postvideo1.css']});
});

module.exports = router;
