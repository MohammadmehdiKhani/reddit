
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const { Community, validateCommunity } = require("../database/schema/communitySchema");
const { User, validateUser } = require("../database/schema/userSchema");
const { Post, validatePost } = require("../database/schema/postSchema");
const auth = require("../middleware/authMiddle");

router.get("/create", auth, async (req, res) => {
    return res.render("createCommunity");
});


router.get("/community/:community_id", auth, async (req, res) => {
    let community = await Community.findById(req.params.community_id)
    let posts = []
    for (let i = 0; i < community.postIds.length; i++){
        let post = await Post.findById(community.postIds[i])
        post.postedBy = await User.findById(post.postedBy)
        post.community = await Community.findById(post.community)
        posts.push(post)
        // console.log(post)
    }
    return res.render("communityPage", {posts: posts, community: community});
});


router.post("/create", auth, async (req, res) => {

    let request = {
        name: req.body.communityName,
        description: req.body.description
    };

    const validationResult = validateCommunity(request);
    if (validationResult.error) {
        request.error = validationResult.error.details[0].message;
        return res.render("createCommunity", request);
    }

    let findedUser = await User.findOne({ _id: req.session.user._id });

    let communityToCreate = {
        name: request.name,
        description: request.description,
        adminIds: [findedUser._id]
    };

    let createdCommunity = await Community.create(communityToCreate);

    let union = _.union(findedUser.adminOfIds, [createdCommunity._id]);
    findedUser.adminOfIds = union;
    await findedUser.save();
    return res.redirect("/");
});

function validateCreateCommunity(request) {
    const schema = Joi.object({
        communityName: Joi.string().required()
    });

    return schema.validate(request);
}

module.exports = router;