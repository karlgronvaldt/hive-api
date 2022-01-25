const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
    // Origin: "http://localhost:8081"
    origin: "*"
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Reveal uploads folder to the public
app.use('/static', express.static('./app/uploads'));

// Connect to database
const db = require("./app/models");
db.mongoose
    .connect(db.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch(err => {
        console.log("Cannot connect to database!", err);
        process.exit();
    });

// Import routes
const userRoutes = require('./app/routes/userRoutes.js');
const postRoutes = require('./app/routes/postRoutes.js');
const authRoutes = require('./app/routes/authRoutes.js');

// Register the routes
authRoutes(app);
userRoutes(app);
postRoutes(app);

// Simple route
app.get("/", (req, res) => {
    return res.status(200).json({ message: "You've reached the HIVE API." });
});

// Set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});