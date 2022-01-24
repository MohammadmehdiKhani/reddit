const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const debug = require("debug")("app:debug");
const { Community, validateCommunity } = require("../database/schema/communitySchema");
const { User, validateUser } = require("../database/schema/userSchema");
const auth = require("../middleware/authMiddle");

router.get("/create", auth, async (req, res) => {
    return res.render("createCommunity");
});

router.post("/create", auth, async (req, res) => {

    let request = {
        name: req.body.communityName,
        description: req.body.description
    };

    const validationResult = validateCommunity(request);
    if (validationResult.error) {
        request.error = validationResult.error.details[0].message;
        return res.render("createCommunity", request);
    }

    let findedUser = await User.findOne({ _id: req.session.user._id });

    let communityToCreate = {
        name: request.name,
        description: request.description,
        adminIds: [findedUser._id]
    };

    let createdCommunity = await Community.create(communityToCreate);

    let union = _.union(findedUser.adminOfIds, [createdCommunity._id]);
    findedUser.adminOfIds = union;
    await findedUser.save();
    return res.redirect("/");
});

function validateCreateCommunity(request) {
    const schema = Joi.object({
        communityName: Joi.string().required()
    });

    return schema.validate(request);
}

module.exports = router;