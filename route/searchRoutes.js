const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const {User, validateUser} = require("../database/schema/userSchema");
const {Community, validateCommunity} = require("../database/schema/communitySchema");
const { Post, validatePost } = require("../database/schema/postSchema");
const debug = require("debug")("app:debug");
const auth = require("../middleware/authMiddle");

router.get("/communities", auth, async (req, res) => {

    let search_value = req.query["searchInput"].trim()
    // console.log(search_value)

    try {

        var communities = await Community.find({
            "$or": [{name: new RegExp(search_value, 'i')}, {description: new RegExp(search_value, 'i')}]
        })

        for (let i = 0; i < communities.length; i++){
            let user = await User.findById(communities[i].adminIds[0]._id)
            communities[i].adminIds[0].username = user.username
        }

        return res.render("searchPage", {
            searchValue: search_value,
            title: "Communities results for " + search_value,
            results: communities,
            isEmpty: communities.length === 0,
            mode: "c"
        })

    } catch (e) {
        console.log(e)
    }

});

router.get("/users", auth, async (req, res) => {

    let search_value = req.query["searchInput"].trim()

    try {
        // await User.createIndexes({username: "text", email: "text"});

        // var users = await User.find(
        //     {$text: {$search: `/${search_value}/`}},
        //     {score: {$meta: "textScore"}}
        // ).sort(
        //     {score: {$meta: "textScore"}}
        // );
        var users = await User.find({username: new RegExp(search_value, 'i')})
        return res.render("searchPage", {
            searchValue: search_value, title: "Users results for " + search_value, results: users, isEmpty: users.length === 0, mode: "u"
        })
    } catch (e) {
        console.log(e)
    }

});


router.get("/", auth, async (req, res) => {

    let search_value = req.query["searchInput"].trim()
    // console.log(search_value)

    try {

        var posts = await Post.find({
            "$or": [{title: new RegExp(search_value, 'i')}, {body: new RegExp(search_value, 'i')}]
        })

        for (let i = 0; i < posts.length; i++){
            let user = await User.findById(posts[i].postedBy._id)
            posts[i].postedBy.username = user.username
        }

        for (let i = 0; i < posts.length; i++){
            let community = await Community.findById(posts[i].community._id)
            posts[i].community.name = community.name
        }

        return res.render("searchPage", {
            searchValue: search_value,
            title: "Posts results for " + search_value,
            results: posts,
            isEmpty: posts.length === 0,
            mode: "p"
        })

    } catch (e) {
        console.log(e)
    }

});


router.post("/users-admins/:community_id", auth, async (req, res) => {

    // console.log(req)
    //
    // console.log(req.params.community_id)

    var community = await Community.findById(req.params.community_id)
    let community_admins = community.adminIds.slice(1)

    let search_value = req.body["searchInput"].trim()


    try {
        var users = await User.find({username: new RegExp(search_value, 'i')})

        //Weird Solution :|
        users = JSON.parse(JSON.stringify(users))

        for (let i = 0; i < users.length; i++){

            // console.log(community_admins)
            // console.log(users[i]._id)
            // console.log(community_admins.includes(mongoose.Types.ObjectId(users[i]._id)))
            //
            // console.log()

            if (community.adminIds[0].equals(users[i]._id)){
                users[i].adminState = "isOwner"
            }
            else if (community_admins.map(admin=>admin.toString()).includes(users[i]._id)) {
                users[i].adminState = "isAdmin"
            } else {
                users[i].adminState = "isNotAdmin"
            }
        }

        // console.log(users[0].adminState)
        // console.log(users)

        return res.status(200).json(users)

    } catch (e) {
        console.log(e)
    }

});


module.exports = router;
