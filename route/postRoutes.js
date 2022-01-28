const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const { Post, validatePost } = require("../database/schema/postSchema");
const { Community, validateCommunity } = require("../database/schema/communitySchema");
const { Comment, validateComment } = require("../database/schema/commentSchema");
const { User, validateUser } = require("../database/schema/userSchema");
const debug = require("debug")("app:debug");
const auth = require("../middleware/authMiddle");

router.get("/create", auth, async (req, res) => {
    return res.status(200).render("createPost");
});

router.post("/create", auth, async (req, res) => {
    debug("===> POST /post");
    debug(`request body is`);
    debug(req.body);

    let request = {
        title: req.body.title,
        body: req.body.body,
        community: req.body.communityId,
        postedBy: req.session.user._id
    };

    debug(request.postedBy)

    const validationResult = validatePost(request);
    if (validationResult.error) {
        request.error = validationResult.error.details[0].message;
        return res.render("createPost", request);
    }

    let postToCreate = {
        title: request.title,
        body: request.body,
        community: request.community,
        postedBy: request.postedBy
    };

    let createdPost = await Post.create(postToCreate);

    let community = await Community.findOne({ _id: request.community });
    let union = _.union(community.postIds, [createdPost._id]);
    community.postIds = union;
    await community.save();

    return res.redirect("/");
});


router.post("/remove", auth, async (req, res) => {

    let current_community = await Community.findById(req.body.communityId)
    current_community.postIds = current_community.postIds.filter( e => !e.equals(mongoose.Types.ObjectId(req.body.postId)))
    await current_community.save()

    await Post.findByIdAndRemove(req.body.postId)

    res.status(200).send("Post deleted Successfully")

});


router.get("/post/:post_id", auth, async (req, res) => {
    let post = await Post.findById(req.params.post_id)

    let post_user = await User.findById(post.postedBy)
    let post_com = await Community.findById(post.community)

    post.postedBy.username = post_user.username
    post.community.name = post_com.name

    let comments = await  Comment.find({parentPost: req.params.post_id}).sort({createdAt: -1})

    for (let i = 0; i < comments.length; i++){
        let user = await User.findById(comments[i].commentedBy)
        comments[i].commentedBy.username = user.username;
    }

    return res.status(200).render("postPage", {post:post, comments: comments});
})


router.post("/post/send_comment", auth, async (req, res) => {

    let commentToCreate = {
        parentPost: req.body.postId,
        body: req.body.commentBody,
        commentedBy: req.session.user._id
    };

    let comment = await Comment.create(commentToCreate);

    let post = await Post.findById(req.body.postId)
    // console.log("HERR", post)
    post.childComments.push(comment._id)
    await post.save()

    return res.status(200).send("Comment sent successfully");
})



module.exports = router;