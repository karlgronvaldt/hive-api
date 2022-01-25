const post = require('../controllers/postsController.js');
const { image } = require("../middleware");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.route('/posts')
        .get(post.findAll)
        .post(image.upload, post.create)
        .delete(post.deleteAll);

    app.route('/posts/:postId')
        // .get(post.find)
        // .put(post.update)
        .delete(post.delete);
};