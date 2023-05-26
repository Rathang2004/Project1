var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var {isLoggedIn} = require("../middleware/auth");
const {getCommentsForPostId, getPostsById} = require("../middleware/posts");
router.post("/create", isLoggedIn, async function (req,res,next){
   var {userId, username} = req.session.user;
    console.log("Request")
    var { postId, commentText } = req.body;
    console.log("Request Body")
    console.log(req.body)

    try
    {
        var [insertResult,_] = await db.execute(`INSERT INTO comments (textCom,fk_postId,fk_authorId) VALUE (?,?,?);`,
            [commentText, postId, userId]);
        if(insertResult && insertResult.affectedRows == 1)
        {
            return res.status(201).json({
                commentId: insertResult.insertId,
                userId: userId,
                username:username,
                commentText: commentText,
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