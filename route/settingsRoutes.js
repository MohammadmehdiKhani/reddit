const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const {User, validateUser} = require("../database/schema/userSchema");
const {Post, validatePost} = require("../database/schema/postSchema");
const {Community, validateCommunity} = require("../database/schema/communitySchema");
const debug = require("debug")("app:debug");
const auth = require("../middleware/authMiddle");


// get requests
router.get("/username", auth, async (req, res) => {
    // let user = await User.findOne({ _id: req.session.user._id })
    return res.status(200).render("changeUsername", {currentUsername: req.session.user.username})
});

router.get("/email", auth, async (req, res) => {
    return res.status(200).render("changeEmail", {currentEmail: req.session.user.email})
});

router.get("/password", auth, async (req, res) => {
    return res.status(200).render("changePassword")
});

router.get("/theme", auth, async (req, res) => {
    return res.status(200).render("changeTheme")
});


// post requests
router.post("/username", auth, async (req, res) => {

    let request = {
        username: req.body.newUsername,
    };

    try {

        let findedUser = await User.findOne({username: request.username});
        if (findedUser) {
            request.error = `User with username ${request.username} already exists`;
            return res.render("changeUsername", {error: request.error, currentUsername: req.session.user.username});
        }


        await User.findOneAndUpdate({username: req.session.user.username}, {username: request.username.trim()})
        request.success = `Username successfully changed from ${req.session.user.username} to ${request.username}`

        req.session.user.username = request.username.trim();
        res.locals.session.username = request.username.trim();

        return res.status(200).render("changeUsername", {success: request.success, currentUsername: request.username})

    } catch (e) {
        request.error = `Unexpected Error!`;
        return res.render("changeUsername", {error: request.error, currentUsername: req.session.user.username});
    }

});

router.post("/email", auth, async (req, res) => {
    let request = {
        email: req.body.newEmail,
    };

    try {

        var new_email_trimmed = request.email.trim();

        let findedEmail = await User.findOne({email: new_email_trimmed});
        if (findedEmail) {
            request.error = `Email with email ${new_email_trimmed} already exists`;
            return res.render("changeEmail", {error: request.error, currentEmail: req.session.user.email});
        }

        await User.findOneAndUpdate({email: req.session.user.email}, {email: new_email_trimmed})
        request.success = `Email successfully changed from ${req.session.user.email} to ${new_email_trimmed}`

        req.session.user.email = new_email_trimmed;
        res.locals.session.email = new_email_trimmed;

        return res.status(200).render("changeEmail", {success: request.success, currentEmail: new_email_trimmed})

    } catch (e) {
        request.error = `Unexpected Error!` + e;
        return res.render("changeEmail", {error: request.error, currentEmail: req.session.user.email});
    }
});

router.post("/password", auth, async (req, res) => {
    let request = {
        current_password: req.body.currentPassword,
        new_password: req.body.newPassword,
    };

    try {

        let findedUser = await User.findOne({username: req.session.user.username});

        if (findedUser.password !== request.current_password){
            request.error = `Incorrect Password!`;
            return res.render("changePassword", {error: request.error});
        } else {

            await User.findOneAndUpdate({username: req.session.user.username}, {password: req.body.newPassword})
            request.success = `Password successfully changed!}`

            req.session.user.password = req.body.newPassword;
            res.locals.session.password = req.body.newPassword;

            return res.status(200).render("changePassword", {success: request.success})

        }


    } catch (e) {
        request.error = `Unexpected Error!` + e;
        return res.render("changeEmail", {error: request.error, currentEmail: req.session.user.email});
    }
});

router.post("/theme", auth, async (req, res) => {
    return res.status(200).render("changeTheme")
});


// router.get("/create", auth, async (req, res) => {
//     return res.status(200).render("changeUsername");
// });
//
// router.post("/create", auth, async (req, res) => {
//     debug("===> POST /post");
//     debug(`request body is`);
//     debug(req.body);
//
//     let request = {
//         title: req.body.title,
//         body: req.body.body,
//         community: req.body.communityId,
//         postedBy: req.session.user._id
//     };
//
//     debug(request.postedBy)
//
//     const validationResult = validatePost(request);
//     if (validationResult.error) {
//         request.error = validationResult.error.details[0].message;
//         return res.render("createPost", request);
//     }
//
//     let postToCreate = {
//         title: request.title,
//         body: request.body,
//         community: request.community,
//         postedBy: request.postedBy
//     };
//
//     let createdPost = await Post.create(postToCreate);
//
//     let community = await Community.findOne({ _id: request.community });
//     let union = _.union(community.postIds, [createdPost._id]);
//     community.postIds = union;
//     await community.save();
//
//     return res.redirect("/");
// });

module.exports = router;