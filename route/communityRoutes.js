const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const {Community, validateCommunity} = require("../database/schema/communitySchema");
const {User, validateUser} = require("../database/schema/userSchema");
const {Post, validatePost} = require("../database/schema/postSchema");
const auth = require("../middleware/authMiddle");

router.get("/create", auth, async (req, res) => {
    return res.render("createCommunity");
});


router.get("/community/:community_id", auth, async (req, res) => {
    let community = await Community.findById(req.params.community_id)

    community.joined = community.memberIds.includes(req.session.user._id)

    let posts = []
    let admins = []

    let isAdmin = false

    for (let i = 0; i < community.postIds.length; i++) {
        let post = await Post.findById(community.postIds[i])
        post.postedBy = await User.findById(post.postedBy)
        post.community = await Community.findById(post.community)
        posts.push(post)
    }

    for (let i = 0; i < community.adminIds.length; i++) {
        let admin = await User.findById(community.adminIds[i])
        admins.push(admin)
        // console.log(req.session.user.username)
        // console.log(admin.username)
        if (req.session.user.username === admin.username) {
            isAdmin = true
        }
    }
    // console.log(isAdmin)
    return res.render("communityPage", {posts: posts, community: community, admins: admins, isAdmin: isAdmin});
});


router.post("/community/:community_id/unjoin", auth, async (req, res) => {
    try {
        let current_user = await User.findById(req.session.user._id)
        current_user.memberOfIds = current_user.memberOfIds.filter( e => !e.equals(mongoose.Types.ObjectId(req.params.community_id)))
        await current_user.save()

        let current_community = await Community.findById(req.params.community_id)
        current_community.memberIds = current_community.memberIds.filter( e => !e.equals(mongoose.Types.ObjectId(req.session.user._id)))
        await current_community.save()

        res.status(200).send("UnJoined Successfully")

    } catch (e) {
        console.log(e)
    }
});


router.post("/community/:community_id/join", auth, async (req, res) => {

    try {

        let current_user = await User.findById(req.session.user._id)
        current_user.memberOfIds.push(mongoose.Types.ObjectId(req.params.community_id))
        await current_user.save()

        let current_community = await Community.findById(req.params.community_id)
        current_community.memberIds.push(mongoose.Types.ObjectId(req.session.user._id))
        await current_community.save()

        res.status(200).send("Joined Successfully")

    } catch (e) {
        console.log(e)
    }
});



router.post("/community/:community_id/changeName", auth, async (req, res) => {

    try {
        let current_community = await Community.findById(req.params.community_id)
        current_community.name = req.body.name
        await current_community.save()
        // console.log(current_community.name)
        res.status(200).send("Name changed Successfully")
    } catch (e) {
        console.log(e)
    }
});


router.post("/community/:community_id/changeDesc", auth, async (req, res) => {

    try {
        let current_community = await Community.findById(req.params.community_id)
        current_community.description = req.body.description
        await current_community.save()
        // console.log(current_community.name)
        res.status(200).send("Name changed Successfully")
    } catch (e) {
        console.log(e)
    }
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

    let findedUser = await User.findOne({_id: req.session.user._id});

    let communityToCreate = {
        name: request.name,
        description: request.description,
        adminIds: [findedUser._id],
        memberIds: [findedUser._id]
    };

    let createdCommunity = await Community.create(communityToCreate);

    let union = _.union(findedUser.adminOfIds, [createdCommunity._id]);
    findedUser.adminOfIds = union;
    await findedUser.save();

    findedUser.memberOfIds.push(mongoose.Types.ObjectId(createdCommunity._id))
    await findedUser.save()


    return res.redirect("/");
});

function validateCreateCommunity(request) {
    const schema = Joi.object({
        communityName: Joi.string().required()
    });

    return schema.validate(request);
}

module.exports = router;