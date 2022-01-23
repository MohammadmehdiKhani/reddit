const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../database/schema/userSchema");
const debug = require("debug")("app:debug");

router.get("/", (req, res) => {
    let data = {
        Title: "Home",
        Subtitle: "Hello"
    }
    return res.status(200).render("home", data);
});

module.exports = router;