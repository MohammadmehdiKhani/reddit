const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const { User, validateUser } = require("../database/schema/userSchema");
const { Community, validateCommunity } = require("../database/schema/communitySchema");
const { Post, validatePost } = require("../database/schema/postSchema");
const auth = require("../middleware/authMiddle");

router.get("/create", (req, res) => {
    return res.render("createUser");
});

router.get("/user/:user_id", auth, async (req, res) => {
    let user = await User.findById(req.params.user_id);

    let posts = []
    let communities_sub = []
    let communities_admin = []

    for (let i = 0; i < user.adminOfIds.length; i++) {
        let community = await Community.findById(user.adminOfIds[i]);
        communities_admin.push(community);
    }

    for (let i = 0; i < user.memberOfIds.length; i++) {
        let community = await Community.findById(user.memberOfIds[i]);
        communities_sub.push(community);
    }


    posts = await Post.find({ postedBy: user._id })
    let userId = req.session.user._id;

    for (let i = 0; i < posts.length; i++) {
        posts[i].postedBy = await User.findById(posts[i].postedBy)
        posts[i].community = await Community.findById(posts[i].community)

        let isLiked = false;

        for (const u of posts[i].likedBies) {
            if (u == userId) {
                isLiked = true;
            }
        }
        posts[i].isLiked = isLiked;
    }

    let isThisMe = (req.session.user.username === user.username)

    return res.render("profilePage", { posts: posts, user: user, communities_sub: communities_sub, communities_admin: communities_admin, isThisMe: isThisMe });


});

router.post("/create", async (req, res) => {
    let request = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    const validationResult = validateUser(request);
    if (validationResult.error) {
        request.error = validationResult.error.details[0].message;
        return res.render("createUser", request);
    }

    let findedUser = await User.findOne({ username: request.username });
    if (findedUser) {
        request.error = `User with username ${request.username} already exists`;
        return res.render("createUser", request);
    }

    // const salt = await bcrypt.genSalt(10);
    // request.password = await bcrypt.hash(request.password, salt);
    let createdUser = await User.create(request);

    req.session.user = createdUser;
    return res.redirect("/");
});

router.get("/login", (req, res) => {
    return res.render("login");
});

router.post("/login", async (req, res) => {
    let request = {
        username: req.body.username,
        password: req.body.password,
    };

    let response = req.body;

    const { error } = validateLoginReq(request);
    if (error) {
        response.error = error.details[0].message;
        return res.render("login", response);
    }

    let findedUser = await User.findOne({ username: request.username });
    if (!findedUser) {
        let msg = {
            error: `User with username ${request.username} does not exists`
        }
        return res.render("login", msg);
    }

    // const isPasswordValid = await bcrypt.compare(request.password, findedUser.password);
    const isPasswordValid = await request.password === findedUser.password;
    if (!isPasswordValid) {
        let msg = {
            error: `Password is incorrect`
        }
        return res.render("login", msg);
    }
    req.session.user = findedUser;
    res.locals.session = req.session.user;
    return res.redirect("/");
});

function validateLoginReq(request) {
    let schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(3).required()
    });

    return schema.validate(request);
}

router.get("/logout", async (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/users/login");
        })
    }
});

router.get("/update", auth, async (req, res) => {
    return res.render("manageUser");
});

router.put("/update", async (req, res) => {
    //update username, password, ...
});

function validateRegisterReq(request) {
    let schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        password: Joi.string().min(5).max(100).required(),
        email: Joi.string().min(5).max(100).required()
    });

    return schema.validate(request);
}

module.exports = router;