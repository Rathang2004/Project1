var pathToFFMPEG = require('ffmpeg-static');
var db = require("../conf/database");
var exec = require('child_process').exec;
module.exports = {
    makeThumbnail: function(req,res,next)
    {
        if(!req.file)
        {
            next(new Error('File upload failed'));
        }
        else
        {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnails-${req.file.filename.split(".")[0]}.png`;
                var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                exec(thumbnailCommand);
                req.file.thumbnails = destinationOfThumbnail;
                next();
            }
            catch (error)
            {
                next(error);
            }

        }
    },
    getPostsForUser: async function (req,res,next)
    {
        var {userId} = req.session.user;
        try
        {
            var [rows,_] = await db.execute(
                `SELECT * FROM posts WHERE fk_userId=?;`,
                [userId]
            );
            if(rows && rows.length == 0)
            {
                req.flash("error", "You don't have any posts to delete");
                next();
                return res.render("profile");
            }
            else
            {
               res.locals.posts = rows;
               req.flash("success","Your account has atleast one existing post");
               next();
               return res.render("profile");
            }
        }
        catch (error)
        {
            next(error);
        }
    },
    getPostsById: async function (req,res,next)
    {
        var {id} = req.params;
        try
        {
            let [rows,_] = await db.execute(
                `select u.username, p.video, p.title, p.description, p.id, p.createdAt
                 from posts p 
                 JOIN users u
                 ON p.fk_userId=u.id
                 WHERE p.id=?;`,
                 [id]);
            const post = rows[0];
            if(!post)
            {
            }
            else
            {
                res.locals.currentPost = post;
                next();
            }
        }
        catch (error)
        {
            next(error);
        }
    },
    getCommentsForPostId: async function (req,res,next)
    {
        var {id} = req.params;
        try
        {
            let [rows,_] = await db.execute(
                `SELECT u.username, c.textCom, c.createdAt
                 FROM comments c 
                 JOIN users u
                 ON c.fk_authorId=u.id
                 WHERE c.fk_postId=?;`,
                 [id]
            );
            res.locals.currentPost.comments = rows;
            next();
        }
        catch (error)
        {
            next(error);
        }
    },
    getRecentPosts: async function (req,res,next)
    {
        try
        {
            const [rows,fields] = await db.execute(`SELECT id, title, video, createdAt, description, thumbnails FROM csc317db.posts ORDER BY createdAt DESC LIMIT 10;`);
            const posts = rows.map(post => ({
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    thumbnails: post.thumbnails,
            }));
            res.locals.posts = posts;
            next();
            //res.render("index",{ title: 'CSC 317 App', name:"Rathang Pandit"}, posts);
        }
        catch(error)
        {
            next(error);
        }
    }
}