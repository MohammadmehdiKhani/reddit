const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const { User, validateUser } = require("../database/schema/userSchema");
const { Community, validateCommunity } = require("../database/schema/communitySchema");
const debug = require("debug")("app:debug");
const auth = require("../middleware/authMiddle");

router.get("/", auth, async (req, res) => {

    let user = await User.findOne({ _id: req.session.user._id }).populate("adminOfIds memberOfIds");
    let adminCommunities = user.adminOfIds;
    let memberCommunities = user.memberOfIds;
    let allCommunities = _.union(adminCommunities, memberCommunities);

    let allPosts = [];

    for (const c of allCommunities) {
        let community = await Community.findOne({ _id: c._id }).populate("postIds");

        for (const p of community.postIds) {
            let postOwner = await User.findOne({ _id: p.postedBy });
            debug(postOwner);
            let communityOfPost = await Community.findOne({ _id: p.community });
            p.postedBy = postOwner;
            p.community = communityOfPost;
        }
        allPosts = _.union(allPosts, community.postIds);
    }

    return res.render("home", { myCommunities: allCommunities, hotCommunities: allCommunities, posts: allPosts });
});

module.exports = router;
