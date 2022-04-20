const Post = require("../models/post");

const PostsController = {
  Index: (req, res) => {
    Post.find()
      .populate("user")
      .populate("comments")
      .sort({ createdAt: -1 })
      .exec((err, posts) => {
        if (err) {
          throw err;
        }
        req.session; // This line appears to be needed for later access to session properties
        console.log("Posts: ", posts);
        // console.log("Comments: ", posts[0].comments);
        const session = {
          posts: posts,
          user: req.session.user,
        };
        res.render("posts/index", session);
      });
  },

  Create: (req, res) => {
    const session = {
      message: req.body.message,
      user: req.session.user,
      image: req.body.image,
    };
    const post = new Post(session);

    post.save((err) => {
      if (err) {
        throw err;
      }
      res.status(201).redirect("/posts");
    });
  },

  AddComment: (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    Post.findById(postId).exec((err, post) => {
      if (err) {
        throw err;
      }
      post.comments.push(commentId);

      post.save((err) => {
        if (err) {
          throw err;
        }
        res.status(204).redirect("/posts");
      });
    });
  },
};

module.exports = PostsController;
