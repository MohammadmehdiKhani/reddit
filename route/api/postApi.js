const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const { Post, validatePost } = require("../../database/schema/postSchema");
const { Community, validateCommunity } = require("../../database/schema/communitySchema");
const { User, validateUser } = require("../../database/schema/userSchema");


router.get("/posts", async (req, res) => {
    let posts = await Post.find({});
    return res.status(200).send(posts);
});

router.post("/posts", async (req, res) => {
    return res.status(200).send(req.body.title);
});

router.put("/like/:id", async (req, res) => {

    let postId = req.params.id;
    let userId = req.session.user._id;

    let post = await Post.findOne({ _id: postId });
    let user = await User.findOne({ _id: userId });

    let userIndex = _.findIndex(post.likedBies, u => u == userId);
    let postIndex = _.findIndex(user.likedPosts, p => p == postId);

    let isLiked = false;
    //user already liked this post
    if (userIndex > -1) {
        post.likedBies.splice(userIndex, 1);
        user.likedPosts.splice(postIndex, 1)
        isLiked = false;
    }
    //user not liked post yet
    else {
        post.likedBies.push(userId);
        user.likedPosts.push(postId);
        isLiked = true;
    }

    user.save();
    post.save();

    return res.status(200).send({ liked: isLiked, likeCount: post.likedBies.length });
});

module.exports = router;