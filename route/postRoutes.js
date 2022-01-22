const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Post, validatePost } = require("../database/schema/postSchema");
const { User, validateUser } = require("../database/schema/userSchema");
const debug = require("debug")("app:debug");
//const authenticate = require("../middleware/authMid");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    let countries = await Country.find({});
    return res.status(200).send(countries);
});

router.post("/post", async (req, res) => {
    debug("===> POST /post");
    debug(`request body is`);
    debug(req.body);

    let request = {
        title: req.body.title,
        body: req.body.body
    };

    const { error } = validateCreatePost(request);
    if (error)
        return res.status(400).send(error.details[0].message);

    let postToCreate = {
        title: request.title,
        body: request.body
    };
    const { error1 } = validatePost(postToCreate);
    if (error1)
        return res.status(400).send(error1.details[0].message);
    let createdPost = await Post.create(postToCreate);

    let postDto = {
        title: createdPost.name,
        body: createdPost.body
    }

    return res.status(200).send(postDto);
});

function validateCreatePost(request) {
    const schema = Joi.object({
        title: Joi.string().required()
    });

    return schema.validate(request);
}

module.exports = router;