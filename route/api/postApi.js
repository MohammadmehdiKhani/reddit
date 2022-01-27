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
    debug(req.session.user);
    debug(req.body);

    return res.status(200).send(req.body.title);
});

router.put("/like/:id", async (req, res) => {

    let postId = req.params.id;
    let userId = req.session.user._id;

    let post = await Post.findOne({ _id: postId });
    let user = await User.findOne({ _id: userId });

    debug("before");
    debug(post);

    let isLikedByUser = _.findIndex(post.likedBies, u => u._id == userId);
    debug(isLikedByUser);

    if (isLikedByUser > -1) {
        post.likedBies = _.remove(post.likedBies, userId);
        user.likedPosts = _.remove(user.likedPosts, postId);
    }
    else {
        post.likedBies.push(userId);
        user.likedPosts.push(postId);
    }

    user.save();
    post.save();

    debug("after");
    debug(post);

    return res.status(200).send({ liked: isLikedByUser });
});

module.exports = router;