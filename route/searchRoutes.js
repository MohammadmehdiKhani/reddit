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
            title: "Communities",
            results: communities,
            isEmpty: communities.length === 0
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
            searchValue: search_value, title: "Users", results: users, isEmpty: users.length === 0
        })
    } catch (e) {
        console.log(e)
    }

});


module.exports = router;
