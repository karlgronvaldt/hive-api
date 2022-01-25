const db = require("../models");
const User = db.user;

exports.checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        "username": req.body.username
    }, (err, user) => {
        if (err) return res.status(500).send({ message: err });

        if (user) {
            return res.status(400).send({
                message: "Failed! Username is already in use!",
                user: user
            });
        }

        // Email
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) return res.status(500).send({ message: err });

            if (user) {
                return res.status(400).send({
                    message: "Failed! Email is already in use!",
                    user: user
                });
            }

            next();
        });
    });
};