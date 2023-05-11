var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const querystring = require("querystring");
var bcrypt = require('bcrypt');
/* GET localhost:3000/users */
/**router.get('/', async function(req, res, next)
{
  try
  {
    let [rows,fields] = await db.query(`select * from users;`);
    res.status(200).json({rows,fields});
  }catch(error)
  {
    next(error);
  }
});**/
//localhost:3000/users/registration
router.post('/registration', async function(req,res,next)
{
    var {username,email,password} = req.body;
    // check if username is unique
    try
    {
      //prevents sql injections; checks if username is unique
      var [rows,fields] = await db.execute(`select id from users where username =?;`, [username]);
      if(rows && rows.length > 0)
      {
        return res.redirect('/registration');
      }
      // check if email is unique
      var [rows,fields] = await db.execute(`select id from users where email =?;`, [email]);
      if(rows && rows.length > 0)
      {
        return res.redirect('/registration');
      }
      var hashedPassword = await bcrypt.hash(password,3);



      //insert
      var [resultObject, fields] = await db.execute(`INSERT INTO users(username,email,password) value (?,?,?);`,[username,email,hashedPassword]);
      //respond
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

/*router.post("/login", async function (req,res,next)
{
    var {username, password} = req.body;
    try{
        var[rows,fields] = await db.execute(`select id from users where username=?`, [username]);
        if(rows && rows.length > 0)
        {
            return res.redirect('/login');
        }
        var[rows, fields] = await db.execute(`select id from users where password=?`, [password]);
        if(rows && rows.length>0)
        {
           return res.redirect('/login');
        }

        var[resultObject, fields] = await db.execute(`INSERT INTO users(username,password) value(?,?);`,[username,password]);
        if(resultObject && resultObject.affectedRows == 1)
        {
            return res.redirect('/');
        }
        else
        {
            return res.redirect('/login')
        }
    }
    catch (error)
    {
        next(error);
    }**/
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

router.get("/profile", function(req,res){
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
