const mongoose = require("mongoose");
const path = require("path");
const mv = require("mv");
const fs = require("fs");

const postScheme = new mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false,
            default: null
        },
        // TODO: Add comments?
        likes: {
            type: Number,
            required: false,
            default: 0
        }
    },
    { timestamps: true }
);

// Move image from tmp folder to uploads/images
postScheme.post('save', function (doc, next) {
    if (!doc.image) next();

    const current = path.join(__dirname, process.env.TMPFOLDER, doc.image);
    const destination = path.join(__dirname, process.env.IMAGEFOLDER, doc.image);

    // Move image from tmp dir to ./uploads/images
    mv(current, destination, (err) => {
        if (err) next(err);
        next();
    });
});

// Delete associated image
postScheme.post('findOneAndDelete', function (doc, next) {
    if (!doc.image) next();

    const imagePath = path.join(__dirname, process.env.IMAGEFOLDER, doc.image);
    fs.unlink(imagePath, (err) => {
        if (err) next(err);
        next();
    });
});

module.exports = mongoose.model("Post", postScheme);
