const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const { User, validateUser } = require("../database/schema/userSchema");
const auth = require("../middleware/authMiddle");

router.get("/create", (req, res) => {
    return res.status(200).render("createUser");
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

    const salt = await bcrypt.genSalt(10);
    request.password = await bcrypt.hash(request.password, salt);
    let createdUser = await User.create(request);

    req.session.user = createdUser;
    return res.render("home");
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

    const isPasswordValid = await bcrypt.compare(request.password, findedUser.password);
    if (!isPasswordValid) {
        let msg = {
            error: `Password is incorrect`
        }
        return res.render("login", msg);
    }
    req.session.user = findedUser;
    return res.render("home");
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

function validateRegisterReq(request) {
    let schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        password: Joi.string().min(5).max(100).required(),
        email: Joi.string().min(5).max(100).required()
    });

    return schema.validate(request);
}

module.exports = router;