const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const mongoose = require("mongoose");

router.get("/posts", async (req, res) => {
    let posts = await Post.find({});
    return res.status(200).send(posts);
});

router.post("/posts", async (req, res) => {
    debug(req.session.user);
    debug(req.body);

    return res.status(200).send(req.body.title);
});

module.exports = router;