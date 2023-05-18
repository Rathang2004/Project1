var pathToFFMPEG = require('ffmpeg-static');
const db = require("../conf/database");
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
    getPostsForUser: function (req,res,next)
    {},
    getPostsById: function (req,res,next)
    {
        let postId = req.params.id;
        let baseSQl = `SELECT p.id, p.title, p.description, p.image, p.createdAt, u.username
        From posts p
        JOIN users uON p.fk_authorID=u.id
        WHERE p.id=?;`;
        db.query(baseSQl,[postId])
            .then(function ([results,fields])
            {
                res.locals.currentPost=results[0];
            })
        next();
    },
    getCommentsForPostId: function (req,res,next)
    {},
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