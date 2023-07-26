const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");



//create a post
router.post("/", async (req, res) => {
  const body = req.body;
  body.username = (await User.findById(req.body.userId)).username;
  const newPost = new Post(body);
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get all posts
router.get("/all", async (req, res) => {
  Post.find({}, function (err, posts) {
    if(err){
      res.send("something wrong");
      next();
    }
    res.json(posts);
  });
});

//delete a post
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json("the post has been deleted");
		} else {
			res.status(403).json("you can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//like / dislike a post
router.put("/:id/like", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("The post has been liked");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json("The post has been disliked");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// get post
router.get("/:id", async (req, res) => {
	try {
    const currentUser = await User.findById(req.params.id);
    const userPosts = await Post.find({ userId: currentUser._id });
		res.status(200).json(userPosts);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
