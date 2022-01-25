const db = require("../models");
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = process.env.JwtSecret;

exports.signup = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const new_user = new User({
        name: {
            firstname: firstname,
            lastname: lastname,
        },
        username: username,
        email: email,
        password: password
    });

    const save_user = await new_user.save();
    if (!save_user) return res.status(400).json({ message: "Failed saving user " });

    return res.status(200).json({ message: `Saved user ${save_user.name.firstname} ${save_user.name.lastname}` });
};

exports.signin = async (req, res) => {
    const user = await User.findOne({ "username": req.body.username });
    if (!user) return res.status(400).json({ message: "No user found!" });

    const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordsMatch) return res.status(400).json({ message: "Invalid password!" });

    const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 86400 // 24 hours
    });

    res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
    });
};