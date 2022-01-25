const express = require("express");
const router = express.Router();
const Joi = require("joi");
// const bcrypt = require("bcryptjs");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const mongoose = require("mongoose");
const { Community, validateCommunity } = require("../../database/schema/communitySchema");


router.get("/", async (req, res) => {
    let communities = await Community.find({});
    return res.status(200).send(communities);
});

router.post("/", async (req, res) => {
    debug(req.session.user);
    debug(req.body);

    return res.status(200).send(req.body.title);
});

module.exports = router;