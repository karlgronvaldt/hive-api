const user = require('../controllers/usersController.js');
const { image, authJwt } = require("../middleware/");

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
      
    app.route('/users')
        .get(user.findAll)
        .delete(user.deleteAll);

    app.route('/users/:userId')
        // .get(authJwt.verifyToken, user.find)
        .get(user.find)
        .put(user.update)
        .delete(user.delete);

    app.route('/users/:userId/image')
        .put(image.upload, user.updateImage);
};