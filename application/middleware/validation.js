var validator= require('validator');
var db = require('../conf/database');
const bcrypt = require("bcrypt");

module.exports =
    {
            usernameCheck: function (req,res,next)
            {
                    var {username} = req.body;
                    console.log('usernameCheck validation')
                    console.log(username)
                    username = username.trim();
                    if(!validator.isLength(username, {min: 3}))
                    {
                            req.flash("error","Username must be 3 or more characters.");
                    }
                    if(!/[a-zA-Z]/.test(username.charAt(0)))
                    {
                            req.flash("error","Username must begin with a character.");
                    }
                    if(req.session.flash.error)
                    {
                            res.redirect('/registration');
                    }
                    else
                    {
                            next();
                    }
            },
            emailCheck: async function(req,res,next)
            {
                    var {email} = req.body;
                    try
                    {
                            var [rows, fields] = await db.execute(`select id from users where email =?;`, [email]);
                            if (rows && rows.length > 0)
                            {
                                    req.flash("error", `${email} is aleady taken`);
                                    return req.session.save(function(err)
                                    {
                                            return res.redirect('/registration');
                                    });
                            }
                            else
                            {
                                    next();
                            }

                    }
                    catch(error)
                    {
                            next(error);
                    }
            },
            isUsernameUnique: async function (req,res,next)
            {
                console.log('usernameUnique')
                let {username} = req.body;
                try
                {
                    var [rows,fields] = await db.execute(`SELECT id FROM users where username =?;`, [username]);
                    if(rows && rows.length > 0)
                    {
                        req.flash("error", `${username} is already taken`);
                        return req.session.save(function(err)
                        {
                            return res.redirect('/registration');
                        });
                    }
                    else
                    {
                        next();
                    }
                }
                catch(error)
                {
                    next(error);
                }
            },
            tosCheck: function (req,res,next)
            {
                var {tosCheck} = req.body;
                if(!tosCheck)
                {
                    req.flash("error", "You must agree to the TOS Terms");
                }
                else
                {
                    next();
                }
            },
            ageCheck: function(req,res,next)
            {
                var {ageCheck} = req.body;
                if(!ageCheck)
                {
                    req.flash("error", "You must agree to the Age Terms");
                }
                else
                {
                    next();
                }
            },
            passwordCheck: function (req,res,next)
            {
                var {password} = req.body;
                if(!validator.isLength(password, {min: 8}))
                {
                    req.flash("error","Password must be 8 or more characters.");
                }
                if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password))
                {
                    req.flash("error","Password must contain a special character.");
                }
                if(!/[A-Z]/.test(password) || !/[a-z]/.test(password))
                {
                    req.flash("error", "Password must contain one lowercase letter and one uppercase 1");
                }
                if(req.session.flash.error)
                {
                    res.redirect('/registration');
                }
                else
                {
                    next();
                }
            },
            isEmailUnique: async function (req,res,next) {
            try
            {
                var {email} = req.body;
                var [rows, fields] = await db.execute(
                    `SELECT id FROM users where email=?`,
                    [email]
                );
                if (rows && rows.length > 0) {
                    req.flash("error", `${email} alreadu exists`);
                    return req.session.save(function (err) {
                        return res.redirect("/registration");
                    });
                } else {
                    next();
                }
            }
            catch(error)
            {
                next(error);
            }
            },
    };
