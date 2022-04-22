const Post = require("../models/post");
const { formatDistanceToNowStrict } = require('date-fns');
const Notification = require("../models/notification");
const User = require("../models/user")

const PostsController = {
  Index: (req, res) => {
    Post.find()
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user" },
      })
      .sort({ createdAt: -1 })
      .exec((err, posts) => {
        if (err) {
          throw err;
        }
        req.session; // This line appears to be needed for later access to session properties
       
        posts.forEach((post) => {
          const datePosted = formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })
          post.createdAtFormatted = datePosted
          post.comments.forEach((comment) => {
            const commentDatePosted = formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })
            comment.createdAtFormatted = commentDatePosted;
          })
        });
        
        const session = {
          posts: posts,
          user: req.session.user,
          loggedInUserId: req.session.user._id,
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
        const notification = new Notification({category: "Comment", user: req.session.user._id})
        notification.save(() => {
          User.findById(post.user).then((user) => {
            user.notifications.push(notification);
            user.save(() => {
              res.status(204).redirect("/posts");
            })
          })
        })
      });
    });
  },
};

module.exports = PostsController;
