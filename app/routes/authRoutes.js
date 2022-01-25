const auth = require('../controllers/authController.js');
const { verifySignUp, image } = require("../middleware");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/users/signup', verifySignUp.checkDuplicateUsernameOrEmail, auth.signup);

    app.post('/users/signin', auth.signin);
};