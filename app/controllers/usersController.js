const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

// GET: /users
exports.findAll = async (req, res) => {
    const users = await User.aggregate([
        {
            $project: {
                _id: 0,
                id: "$_id",
                firstname: "$name.firstname",
                lastname: "$name.lastname",
                username: 1,
                email: 1,
                image: 1
            }
        }
    ]);

    if (!users) return res.status(400).json({ message: "No users found! "});

    res.status(200).json(users);
};

// GET: /users/:userId
exports.find = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(user);
    });
};

// PUT: /users/:userId
exports.update = function(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        req.body,
        { new: true },
        (err, user) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json({ message: "User updated", user: user });
        }
    );
};

// PUT: /users/:userId/image
exports.updateImage = function(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { image: req?.file?.filename },
        { new: true },
        (err, user) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json({ message: "User updated", user: user });
        }
    );
};

// DELETE: /users/:userId
exports.delete = (req, res) => {
    User.findOneAndDelete(
        { _id: req.params.userId },
        (err, user) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json({ message: "User deleted", user: user._id });
        }
    );
};

// DELETE: /users
// DELETE ALL (DEV ONLY!)
exports.deleteAll = (req, res) => {
    const uploads = path.join(__dirname, process.env.AVATARFOLDER);
    User.deleteMany({}, (err, user) => {
        if (err) return res.status(400).json(err);
        // Empty uploads dir
        fs.readdir(uploads, (err, avatars) => {
            if (err) return res.status(400).json(err);

            for (const avatar of avatars) {
                fs.unlink(path.join(uploads, avatar), (err) => {
                    if (err) return res.status(400).json(err);
                });
            }
        });

        return res.status(200).json("Deleted all users and avatars!");
    });
};