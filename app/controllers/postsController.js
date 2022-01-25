const db = require("../models");
const Post = db.post;

const path = require("path");
const fs = require("fs");

// GET: /posts
exports.findAll = async (req, res) => {
    const posts = await Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userid",
                foreignField: "_id",
                as: "users"
            }
        },
        { $unwind: "$users" },
        {
            $project: {
                _id: 0,
                id: "$_id",
                description: 1,
                "firstname": "$users.name.firstname",
                "lastname": "$users.name.lastname",
                username: 1,
                createdAt: 1,
                image: 1
            }
        }
    ]);

    if (!posts) return res.status(400).json({ message: "No posts found!" });

    return res.status(200).json(posts);
};

// GET: /users/:postId
// exports.find = async (req, res) => {
//     const post = await Post.findById(req.params.postId);
//     if (!post) return res.status(400).json({ message: "No post found! "});

//     return res.status(200).json(post);
// };

// POST: /posts
exports.create = async (req, res) => {
    const { userid, description } = req.body;
    const image = req?.file?.filename || null;
    const new_post = new Post({
        userid,
        description,
        image
    });

    const save_post = await new_post.save();
    if (!save_post) return res.status(400).json({ message: "Failed saving post " });

    return res.status(200).json({ message: "Post saved!" });
};

// PUT: /users/:postId
// exports.update = (req, res) => {
//     Post.findOneAndUpdate(
//         { _id: req.params.postId },
//         req.body,
//         { new: true },
//         (err, post) => {
//             if (err) return res.status(400).json(err);
//             return res.status(200).json(post);
//         }
//     );
// };

// DELETE: /users/:postId
exports.delete = (req, res) => {
    Post.findOneAndDelete(
        { _id: req.params.postId },
        (err, post) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json({ message: "Post deleted", post: post._id });
        }
    );
};

// DELETE: /posts
// DELETE ALL (DEV ONLY!)
exports.deleteAll = (req, res) => {
    const uploads = path.join(__dirname, process.env.IMAGEFOLDER);
    Post.deleteMany({}, (err, post) => {
        if (err) return res.status(400).json(err);
        // Empty uploads dir
        fs.readdir(uploads, (err, images) => {
            if (err) return res.status(400).json(err);

            for (const image of images) {
                fs.unlink(path.join(uploads, image), (err) => {
                    if (err) return res.status(400).json(err);
                });
            }
        });

        return res.status(200).json("Deleted all posts and images!");
    });
};
