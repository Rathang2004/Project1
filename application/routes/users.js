var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const querystring = require("querystring");
var bcrypt = require('bcrypt');
var {isLoggedIn, isMyProfile} = require('../middleware/auth');
const {usernameCheck, isUsernameUnique, passwordCheck, emailCheck, tosCheck, ageCheck, isEmailUnique} = require("../middleware/validation");
const {response} = require("express");
/* GET localhost:3000/users */
/**router.get('/', async function(req, res, next)
{
    var {}
  try
  {
    let [rows,fields] = await db.query(`select * from users;`);
    res.status(200).json({rows,fields});
  }catch(error)
  {
    next(error);
  }
});**/


/**
 * const posts = postRows.map((post) => {
 *             //if(postRows && postRows.length === 0)
 *             //{
 *             return
 *             {
 *                 id: post.id,
 *                 title: post.title,
 *                 description: post.description,
 *                 thumbnails: post.thumbnails;
 *             };
 *             //}
 *         });
 */


//localhost:3000/users/registration
router.post('/registration', usernameCheck, emailCheck, passwordCheck, tosCheck, ageCheck, isUsernameUnique, isEmailUnique, async function(req,res,next)
{
    var {username,email,password} = req.body;
    console.log(req.body)
    // check if username is unique
    try
    {
      var hashedPassword = await bcrypt.hash(password, 3);
      //insert
      var [resultObject, fields] = await db.execute(`INSERT INTO users(username,email,password)
      value (?,?,?);`,[username,email,hashedPassword]);
      //respond
        console.log(req.body);
        console.log(resultObject);
      if(resultObject && resultObject.affectedRows == 1)
      {
          return res.redirect('/login');
      }
      else
      {
          return res.redirect('/registration');
      }
    }
    catch(error)
    {
        next(error);
    }

});

router.post("/login", async function (req,res,next)
{
    const {username, password} = req.body;
        if (!username || !password)
        {
            return res.redirect("/login");
        }
        else
        {
            var [rows, fields] = await db.execute(`select id,username,password,email from users where username =?;`, [username]);
            var user = rows[0];
            if (!user)
            {
                req.flash('error', `Login Failed: Invalid username/password`);
                req.session.save(function(err)
                {
                    return res.redirect("/login");
                })
            }
            else
            {
                var passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch)
                {
                    req.session.user =
                    {
                        userId: user.id,
                        email: user.email,
                        username: user.username,
                    };
                    req.flash('success', `You are now Logged In`);
                    req.session.save(function(err)
                    {
                        return res.redirect("/");
                    });
                }
                else
                {
                    return res.redirect("/login");
                }
            }
        }
});

router.use(function(req,res,next)
 {
  if(req.session.user)
  {
    next();
  }
  else
  {
    return res.redirect('/login');
  }
 });

router.get("/profile/:id(\\d+)", isLoggedIn, isMyProfile, function(req,res){
    res.render('profile', {title: "Profile Page", css: ['profile1.css']});
});

router.get('/logout',function (req,res,next)
{
    req.session.destroy(function(err)
    {
        if(err)
        {
            next(err);
        }
        else
        {
            return res.redirect('/');
        }
    })
});

module.exports = router;
