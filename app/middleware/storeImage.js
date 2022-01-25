const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, process.env.TMPFOLDER));
    },
    filename: (req, file, cb) => {
        // Change fom random string to user ID (busboy?)
        const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, prefix + "." + file.originalname);
    }
});

// Object to store image
const store = multer({
    storage,
    // limits: { fileSize: 20000000 }, // 2MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

// Regex image filetypes
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb('filetype'); // Return error 'filetype'
};

// Middleware the handles image upload
exports.upload = (req, res, next) => {
    const upload = store.single('image');
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError)
            return res.status(400).send('File too large');
        else if (err) {
            if (err === 'filetype') return res.status(400).send('Image files only');
            return res.status(500).send(err);
        }

        next();
    });
};