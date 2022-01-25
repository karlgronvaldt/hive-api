const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const mv = require("mv");
const fs = require("fs");

const userScheme = new mongoose.Schema(
    {
        name: {
            firstname: {
                type: String,
                required: true
            },
            lastname: {
                type: String,
                required: true
            }
        },
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            match: /.+\@.+\..+/,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
            default: null
        }
    },
    { timestamps: true }
);

// Always hash passwords before saving to db
userScheme.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

// Move image from tmp folder to uploads/avatars
userScheme.post('findOneAndUpdate', function (doc, next) {
    if (!doc.image) next();

    const current = path.join(__dirname, process.env.TMPFOLDER, doc.image);
    const destination = path.join(__dirname, process.env.AVATARFOLDER, doc.image);

    // Move image from tmp dir to ./uploads/avatars
    mv(current, destination, (err) => {
        if (err) next(err);
        next();
    });
});

// Delete associated image
userScheme.post('findOneAndDelete', function (doc, next) {
    if (!doc.image) next();

    const imagePath = path.join(__dirname, process.env.AVATARFOLDER, doc.image);
    fs.unlink(imagePath, (err) => {
        if (err) next(err);
        next();
    });
});

module.exports = mongoose.model("User", userScheme);
