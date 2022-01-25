const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const {User, validateUser} = require("../database/schema/userSchema");
const {Community, validateCommunity} = require("../database/schema/communitySchema");
const debug = require("debug")("app:debug");
const auth = require("../middleware/authMiddle");

router.get("/", auth, async (req, res) => {

    let search_value = req.query["searchInput"].trim()
    console.log(search_value)

    try {

        var communities = await Community.find({
            "$or": [{name: new RegExp(search_value, 'i')}, {description: new RegExp(search_value, 'i')}]
        })

        console.log(communities)

        return res.render("searchPage", {
            searchValue: search_value,
            title: "Communities",
            resultsCommunities: communities
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
        console.log(users)
        return res.render("searchPage", {searchValue: search_value, title: "Users"})
    } catch (e) {
        console.log(e)
    }

});


module.exports = router;
