var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var {isLoggedIn} = require("../middleware/auth");
const {getCommentsForPostId, getPostsById} = require("../middleware/posts");

router.post("/create", isLoggedIn, async function (req,res,next){
    console.log("hello1")
    var {userId, username} = req.session.user;
    console.log("hello2")
    var {postId, comment} = req.body;
    console.log("hello3")
    console.log(req.body)

    try
    {
        var [insertResult,_] = await db.execute(`INSERT INTO comments (textCom,fk_postId,fk_authorId) VALUE (?,?,?);`,
            [comment, postId, userId]);
        if(insertResult && insertResult.affectedRows == 1)
        {
            return res.status(201).json({
                commentId: insertResult.insertId,
                userId: userId,
                username:username,
                commentText:comment,
            });
        }
        else
        {
            res.json({
                message: "error"
            });
        }
        console.log("hello4")
    }
    catch(error)
    {
        next(error);
        console.log("hello!!!")
    }
    console.log(req.body);
});
module.exports = router;